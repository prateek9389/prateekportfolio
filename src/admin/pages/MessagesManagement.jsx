import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    Mail,
    MailOpen,
    MessageSquare,
    Calendar,
    X,
    User,
    MoreVertical
} from 'lucide-react';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const MessagesManagement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const messagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesData);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteDoc(doc(db, 'messages', id));
                toast.success('Message deleted');
                fetchMessages();
                if (selectedMessage?.id === id) setSelectedMessage(null);
            } catch (error) {
                toast.error('Failed to delete message');
            }
        }
    };

    const handleRead = async (message) => {
        setSelectedMessage(message);
        if (!message.read) {
            try {
                await updateDoc(doc(db, 'messages', message.id), { read: true });
                setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
            } catch (error) {
                console.error("Error updating read status:", error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Inbox</h1>
                <p className="text-gray-400 mt-2">Manage inquiries and feedback from your portfolio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="col-span-3 glass-card p-20 rounded-3xl text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">No messages yet.</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <motion.div
                            layout
                            key={message.id}
                            onClick={() => handleRead(message)}
                            className={`
                glass-card p-6 rounded-2xl cursor-pointer transition-all border border-white/5 relative group
                ${!message.read ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' : 'hover:border-white/10'}
              `}
                        >
                            {!message.read && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${!message.read ? 'bg-primary/20 text-primary-light' : 'bg-white/5 text-gray-400'}`}>
                                    {!message.read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className={`font-bold ${!message.read ? 'text-white' : 'text-gray-300'}`}>{message.name}</h3>
                                    <p className="text-xs text-gray-500">{message.email}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h4 className="text-sm font-semibold text-white/90 truncate">{message.subject}</h4>
                                <p className="text-sm text-gray-400 line-clamp-2">{message.message}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                    <Calendar size={12} />
                                    {message.createdAt?.toDate().toLocaleDateString()}
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, message.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-xl rounded-3xl overflow-hidden z-10 p-8 md:p-10 relative"
                        >
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedMessage.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedMessage.name}</h2>
                                    <p className="text-gray-400">{selectedMessage.email}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-xs font-bold text-primary-light uppercase tracking-widest block mb-2">Subject</span>
                                    <p className="text-lg font-bold">{selectedMessage.subject}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-xs font-bold text-primary-light uppercase tracking-widest block mb-2">Message</span>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    Sent on {selectedMessage.createdAt?.toDate().toLocaleString()}
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={(e) => handleDelete(e, selectedMessage.id)}
                                    className="px-6 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessagesManagement;
