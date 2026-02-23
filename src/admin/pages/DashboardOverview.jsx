import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';

const StatCard = ({ title, value, icon: Icon, color, index, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${color}`} />

        <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('bg-', 'text-').replace('-500', '')} ${color.replace('500', '10')}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-white/5 animate-pulse rounded-md mt-1" />
                ) : (
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                )}
            </div>
        </div>
    </motion.div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState([
        { title: 'Total Projects', value: '0', icon: Briefcase, color: 'bg-blue-500', collection: 'projects' },
        { title: 'Total Skills', value: '0', icon: Code, color: 'bg-purple-500', collection: 'skills' },
        { title: 'New Messages', value: '0', icon: MessageSquare, color: 'bg-cyan-500', collection: 'messages', countNew: true },
        { title: 'Experience Nodes', value: '0', icon: Users, color: 'bg-pink-500', collection: 'experiences' },
    ]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Counts
                const newStats = await Promise.all(stats.map(async (stat) => {
                    let q;
                    if (stat.countNew) {
                        q = query(collection(db, stat.collection), where('read', '==', false));
                    } else {
                        q = collection(db, stat.collection);
                    }
                    const snap = await getDocs(q);
                    return { ...stat, value: snap.size.toString() };
                }));
                setStats(newStats);

                // Fetch Recent Messages
                const qMsg = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(3));
                const msgSnap = await getDocs(qMsg);
                setRecentMessages(msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Recent Projects
                const qProj = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3));
                const projSnap = await getDocs(qProj);
                setActiveProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard <span className="text-gray-500 font-normal">Overview</span></h1>
                <p className="text-gray-400 mt-2">Here's what's happening with your portfolio lately.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={stat.title} {...stat} index={index} loading={loading} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="glass-card p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6">Recent Messages</h3>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />)
                        ) : recentMessages.length > 0 ? (
                            recentMessages.map((msg) => (
                                <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold">
                                            {msg.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold">{msg.name}</h4>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{msg.subject}</p>
                                        </div>
                                    </div>
                                    {!msg.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No messages yet.</p>
                        )}
                    </div>
                    <button onClick={() => window.location.href = '/admin/dashboard/messages'} className="w-full mt-6 py-3 rounded-xl border border-white/5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest font-mono text-[10px]">
                        View All Messages
                    </button>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6">Recent Projects</h3>
                    <div className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />)
                        ) : activeProjects.length > 0 ? (
                            activeProjects.map((proj) => (
                                <div key={proj.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <div className="w-16 h-12 rounded-lg bg-gray-800 overflow-hidden">
                                        <img src={proj.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold">{proj.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-mono mt-1">{proj.tags?.[0] || 'Web App'}</p>
                                    </div>
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary-light">
                                        <Briefcase size={14} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No projects yet.</p>
                        )}
                    </div>
                    <button onClick={() => window.location.href = '/admin/dashboard/projects'} className="w-full mt-6 py-3 rounded-xl border border-white/5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest font-mono text-[10px]">
                        Manage Projects
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
