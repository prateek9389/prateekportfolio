import { motion } from 'framer-motion';
import { ArrowRight, Download, Cpu, Sparkles, Orbit } from 'lucide-react';
import SocialLinks from './SocialLinks';

const Hero = ({ profile }) => {
    const defaultData = {
        name: 'JOHN DOE',
        title: 'Architecting the future through Neural Networks and Distributed Systems.',
        bio: 'Engineering sophisticated digital experiences with unparalleled precision.'
    };

    const data = profile || defaultData;

    // Choose the best resume link (prioritize PDF, then Image)
    const rawResumeLink = data.resumeUrl || data.resumeImageUrl;

    // Force download for Cloudinary URLs where possible
    const getDownloadUrl = (url) => {
        if (!url) return "/resume.pdf";
        if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
            // fl_attachment forces the browser to download the file instead of just opening it
            return url.replace('/image/upload/', '/image/upload/fl_attachment/');
        }
        return url;
    };

    const finalResumeLink = getDownloadUrl(rawResumeLink);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
            {/* AI Grid Background */}
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

            {/* AI Scan Line */}
            <div className="ai-scan-line top-0" />

            {/* Background Animated Blobs */}
            <div className="animated-blob top-[-10%] left-[-10%] animate-pulse-slow opacity-30" />
            <div className="animated-blob bottom-[-10%] right-[-10%] animate-pulse-slow delayed-blob opacity-20" style={{ animationDelay: '2s' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Profile Image with Animated Ring */}
                    {data.profileImage && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-10"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent-cyan to-accent-violet animate-spin-slow opacity-50 blur-md" />
                            <div className="absolute inset-[2px] rounded-full bg-[#030014] z-10" />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-[4px] rounded-full overflow-hidden z-20 border border-white/10"
                            >
                                <img
                                    src={data.profileImage}
                                    alt={data.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Decorative Particles */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                        rotate: 360
                                    }}
                                    transition={{
                                        duration: 3 + i,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                    className="absolute -inset-4 rounded-full border border-primary/20 pointer-events-none"
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* System Status Badge */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/30 bg-primary/5 text-primary-light text-xs font-mono backdrop-blur-xl"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
                        </span>
                        PORTFOLIO // AVAILABLE_FOR_HIRING
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-tight sm:leading-none">
                        <span className="text-white">HELLO. I AM</span>
                        <br />
                        <span className="text-gradient drop-shadow-[0_0_15px_rgba(99,102,241,0.3)] uppercase break-words">
                            {data.name}
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-light">
                        {data.title}
                        <br />
                        <span className="text-white/80">{data.bio}</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-3 group relative overflow-hidden"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>VIEW PROJECTS</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.a>

                        <motion.a
                            href={finalResumeLink}
                            download="Resume"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline flex items-center gap-3 group"
                        >
                            <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                            <span>DOWNLOAD CV</span>
                        </motion.a>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-12"
                    >
                        <SocialLinks />
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Tech Elements */}
            <div className="absolute top-1/4 left-10 md:left-20 animate-float opacity-30 hidden lg:block">
                <Cpu className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <div className="absolute top-1/3 right-10 md:right-24 animate-float opacity-30 hidden lg:block" style={{ animationDelay: '2s' }}>
                <Orbit className="w-16 h-16 text-accent-cyan animate-spin-slow" />
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent z-10" />
        </section>
    );
};

export default Hero;

