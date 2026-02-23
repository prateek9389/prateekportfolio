import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit3,
    X,
    Briefcase,
    Calendar,
    MapPin,
    ExternalLink
} from 'lucide-react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const ExperiencesManagement = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState(null);

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        location: '',
        duration: '',
        description: '',
        isCurrent: false,
        website: ''
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExperiences(data);
        } catch (error) {
            console.error("Error fetching experiences:", error);
            toast.error("Failed to load experiences");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const expData = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (editingExp) {
                await updateDoc(doc(db, 'experiences', editingExp.id), expData);
                toast.success('Experience updated!');
            } else {
                await addDoc(collection(db, 'experiences'), {
                    ...expData,
                    createdAt: serverTimestamp()
                });
                toast.success('Experience added!');
            }
            closeModal();
            fetchExperiences();
        } catch (error) {
            toast.error("Error saving experience");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            try {
                await deleteDoc(doc(db, 'experiences', id));
                toast.success('Experience deleted');
                fetchExperiences();
            } catch (error) {
                toast.error('Failed to delete experience');
            }
        }
    };

    const openModal = (exp = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                company: exp.company,
                role: exp.role,
                location: exp.location,
                duration: exp.duration,
                description: exp.description,
                isCurrent: exp.isCurrent || false,
                website: exp.website || ''
            });
        } else {
            setEditingExp(null);
            setFormData({
                company: '',
                role: '',
                location: '',
                duration: '',
                description: '',
                isCurrent: false,
                website: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExp(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage <span className="text-gray-500 font-normal">Experience</span></h1>
                    <p className="text-gray-400 mt-2">Document your professional journey and career milestones.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Experience
                </button>
            </div>

            {loading && !isModalOpen ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="glass-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between group gap-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary-light">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{exp.role}</h3>
                                        <p className="text-primary-light font-bold flex items-center gap-2">
                                            {exp.company}
                                            {exp.isCurrent && <span className="text-[9px] px-2 py-0.5 bg-primary/20 rounded-full border border-primary/30 uppercase tracking-[0.2em]">Current</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-mono">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-primary-light/50" />
                                        {exp.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary-light/50" />
                                        {exp.location}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl line-clamp-2 md:line-clamp-none">
                                    {exp.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all self-end md:self-center">
                                <button
                                    onClick={() => openModal(exp)}
                                    className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                                    title="Edit Experience"
                                >
                                    <Edit3 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="p-3 hover:bg-red-400/20 rounded-xl transition-colors text-gray-400 hover:text-red-400"
                                    title="Delete Experience"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="text-center py-20 glass-card rounded-3xl">
                            <Briefcase size={40} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-500">No experiences added yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden z-10 p-8 md:p-10 relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-8">
                                {editingExp ? 'Edit Experience' : 'Add New Experience'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Company Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="input-glass"
                                            placeholder="Tech Corp"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Role</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="input-glass"
                                            placeholder="Senior Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Duration</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="input-glass"
                                            placeholder="Jan 2020 - Present"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Location</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="input-glass"
                                            placeholder="New York, USA (Remote)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all ${formData.isCurrent ? 'bg-primary border-primary' : 'bg-white/5'}`}>
                                            {formData.isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isCurrent}
                                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">I am currently working in this role</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-400 mb-2 block">Key Responsibilities / Achievements</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-glass h-32 resize-none"
                                        placeholder="Describe your role and key accomplishments..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                                    >
                                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {editingExp ? 'UPDATE_EXPERIENCE' : 'SAVE_EXPERIENCE'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperiencesManagement;
