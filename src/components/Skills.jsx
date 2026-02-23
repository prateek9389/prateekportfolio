import { motion } from 'framer-motion';

const SkillBar = ({ name, percentage, index }) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-gray-400">SKILL: {name}</span>
                <span className="text-xs font-mono text-primary-light">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent-cyan via-primary to-accent-violet rounded-full relative z-10"
                />
                <div className="absolute inset-0 bg-primary/5 blur-sm" />
            </div>
        </div>
    );
};

const Skills = ({ skills, profile }) => {
    const defaultSkills = {
        "Neural_Frontend": [
            { name: "React / Next.js", level: 95 },
            { name: "Tailwind CSS", level: 98 },
            { name: "TypeScript", level: 85 },
            { name: "Framer Motion", level: 90 }
        ],
        "Kernel_Backend": [
            { name: "Node.js / Express", level: 88 },
            { name: "Firebase / Firestore", level: 92 },
            { name: "PostgreSQL", level: 80 },
            { name: "Python", level: 75 }
        ],
        "System_Integration": [
            { name: "Git / GitHub", level: 95 },
            { name: "Docker", level: 70 },
            { name: "AWS", level: 65 },
            { name: "Figma", level: 85 }
        ]
    };

    const displaySkills = skills || defaultSkills;
    const categories = Object.keys(displaySkills);

    // Dynamic Heading Logic
    const skillsTitle = profile?.skillsTitle || "SYSTEM PROWESS";
    // For the gradient effect, we'll split the title into two parts if it has two or more words
    const titleParts = skillsTitle.split(' ');
    const mainTitle = titleParts.slice(0, -1).join(' ');
    const lastWord = titleParts[titleParts.length - 1];

    const skillsSubtitle = profile?.skillsSubtitle || "Mapping the technical architecture and neural throughput of my development stack. Optimized for high-concurrency and superior visual fidelity.";

    return (
        <section id="skills" className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="font-mono text-[10px] text-primary tracking-[0.4em] mb-4 uppercase">TECHNICAL_STACK // 02</div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
                            {mainTitle} <span className="text-gradient">{lastWord}</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            {skillsSubtitle}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: catIndex * 0.2, duration: 0.8 }}
                            className="glass-card p-1 bg-white/5 hover:bg-white/10 transition-colors duration-500 rounded-2xl group"
                        >
                            <div className="p-7">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <h3 className="text-xs font-mono font-black tracking-[0.2em] text-white">
                                        {category.toUpperCase()}
                                    </h3>
                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary shadow-[0_0_8px_rgba(99,102,241,0)] group-hover:shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all" />
                                </div>
                                <div className="space-y-2">
                                    {displaySkills[category].map((skill, index) => (
                                        <SkillBar
                                            key={skill.name}
                                            name={skill.name}
                                            percentage={skill.level}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 pointer-events-none" />
        </section>
    );
};

export default Skills;
