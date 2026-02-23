import { motion } from 'framer-motion';
import SocialLinks from './SocialLinks';

const FloatingSocialBar = () => {
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:block"
        >
            <div className="glass-card p-4 rounded-full border border-white/10 backdrop-blur-2xl bg-white/5 shadow-2xl relative">
                {/* Decorative Line Top */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-t from-primary/50 to-transparent" />

                <SocialLinks variant="vertical" />

                {/* Decorative Line Bottom */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
            </div>
        </motion.div>
    );
};

export default FloatingSocialBar;
