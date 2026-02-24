import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Code,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    Bell,
    Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/admin/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const navItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Projects', icon: Briefcase, path: '/admin/dashboard/projects' },
        { name: 'Skills', icon: Code, path: '/admin/dashboard/skills' },
        { name: 'Messages', icon: MessageSquare, path: '/admin/dashboard/messages' },
        { name: 'Profile', icon: User, path: '/admin/dashboard/profile' },
        { name: 'Social Profiles', icon: Share2, path: '/admin/dashboard/socials' },
        { name: 'Experience', icon: Briefcase, path: '/admin/dashboard/experience' },
    ];

    return (
        <div className="min-h-screen bg-[#050510] text-white flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className="glass-navbar border-r border-white/5 flex flex-col z-30 relative"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {sidebarOpen ? (
                            <motion.span
                                key="full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold tracking-tight text-gradient"
                            >
                                ADMIN PANEL
                            </motion.span>
                        ) : (
                            <motion.div
                                key="icon"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
                            >
                                <LayoutDashboard className="w-5 h-5 text-primary-light" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin/dashboard'}
                            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? '' : 'mx-auto'}`} />
                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`
              w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200
              ${sidebarOpen ? '' : 'justify-center'}
            `}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto">
                {/* Top Header */}
                <header className="glass-navbar h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg md:text-xl font-bold md:block hidden">Welcome back, Admin</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">{currentUser?.email}</p>
                                <p className="text-[10px] text-gray-500 font-medium tracking-widest mt-1 uppercase">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-violet p-0.5">
                                <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
                                    <User size={20} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
