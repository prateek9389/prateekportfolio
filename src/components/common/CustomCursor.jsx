import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] mix-blend-screen"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 2 : 1,
                    backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-accent-cyan pointer-events-none z-[9999]"
                animate={{
                    x: mousePosition.x - 3,
                    y: mousePosition.y - 3,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 450, mass: 0.2 }}
            />
        </>
    );
};

export default CustomCursor;
