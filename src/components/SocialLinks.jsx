import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const SocialLinks = ({ variant = 'default' }) => {
    const [socials, setSocials] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'socials'),
            (doc) => {
                if (doc.exists()) {
                    setSocials(doc.data());
                }
                setLoading(false);
            },
            (error) => {
                console.error("SocialLinks snapshot error:", error);
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    if (loading) {
        return (
            <div className={`flex items-center gap-4 ${variant === 'vertical' ? 'flex-col' : 'justify-center'}`}>
                {[1, 2].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!socials) return null;

    const links = [
        {
            id: 'github',
            icon: Github,
            url: socials.github,
            label: 'Visit GitHub',
            visible: socials.isGithubVisible
        },
        {
            id: 'linkedin',
            icon: Linkedin,
            url: socials.linkedin,
            label: 'Visit LinkedIn',
            visible: socials.isLinkedinVisible
        },
        {
            id: 'twitter',
            icon: Twitter,
            url: socials.twitter,
            label: 'Visit Twitter',
            visible: socials.isTwitterVisible
        }
    ].filter(link => link.visible && link.url);

    if (links.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const formatUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const getStyles = (id) => {
        switch (id) {
            case 'github': return 'hover:text-[#333] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]';
            case 'linkedin': return 'hover:text-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.3)]';
            case 'twitter': return 'hover:text-[#1da1f2] hover:shadow-[0_0_15px_rgba(29,161,242,0.3)]';
            default: return '';
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`flex items-center gap-6 ${variant === 'vertical' ? 'flex-col' : 'justify-center'} ${variant === 'footer' ? 'gap-4' : ''}`}
        >
            {links.map((link) => (
                <motion.a
                    key={link.id}
                    href={formatUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                        relative group p-3 rounded-full bg-white/5 border border-white/10 
                        backdrop-blur-md transition-all duration-300
                        ${getStyles(link.id)}
                        ${variant === 'footer' ? 'p-2 bg-transparent border-none' : ''}
                    `}
                    title={link.label}
                >
                    <link.icon className={`${variant === 'footer' ? 'w-5 h-5' : 'w-6 h-6'}`} />

                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {link.label}
                    </span>

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.a>
            ))}
        </motion.div>
    );
};

export default SocialLinks;
