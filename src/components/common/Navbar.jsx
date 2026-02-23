import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Terminal } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'PROJECTS', href: '#projects', icon: '01' },
        { name: 'SKILLS', href: '#skills', icon: '02' },
        { name: 'ABOUT', href: '#about', icon: '03' },
        { name: 'CONTACT', href: '#contact', icon: '04' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-navbar py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 group outline-none">
                        <div className="relative">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                                <Cpu className="w-6 h-6 text-accent-cyan group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="absolute -inset-1 bg-primary/20 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white leading-none uppercase">
                                PORTFOLIO
                            </span>
                            <span className="text-[10px] font-mono text-primary/60 tracking-[0.2em]">OS v2.0.4</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="group relative px-4 py-2 outline-none"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-mono text-primary/40 group-hover:text-primary-light transition-colors">{link.icon}</span>
                                    <span className="text-sm font-bold tracking-widest text-gray-400 group-hover:text-white transition-all duration-300 uppercase">
                                        {link.name}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 shadow-[0_0_10px_#6366f1]" />
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-primary-light hover:text-white focus:outline-none transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 md:hidden bg-[#030014]/95 backdrop-blur-2xl"
                    >
                        <div className="flex flex-col h-full pt-24 px-6 space-y-4">
                            <div className="text-[10px] font-mono text-primary/40 tracking-[0.3em] mb-4">SYSTEM_MENU</div>
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between group py-4 border-b border-white/5"
                                >
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xs font-mono text-primary/40">{link.icon}</span>
                                        <span className="text-2xl font-black text-gray-300 group-hover:text-white group-hover:translate-x-2 transition-all">
                                            {link.name}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

