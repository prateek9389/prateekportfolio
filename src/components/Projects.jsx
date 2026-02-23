import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="glass-card group flex flex-col h-full rounded-2xl border border-white/5 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500"
        >
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Technical Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                    <span className="text-[10px] font-mono text-white/70">ARCH_V2.0_READY</span>
                </div>
            </div>

            <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-primary-light/60 tracking-widest">
                    <Layers className="w-3 h-3" />
                    <span>MOD_ID: 00{index + 1}</span>
                </div>

                <h3 className="text-2xl font-black mb-3 text-white tracking-tighter group-hover:text-primary-light transition-colors">
                    {project.title.toUpperCase()}
                </h3>

                <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-[9px] font-mono font-bold text-accent-cyan/80 bg-accent-cyan/5 border border-accent-cyan/10 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-6 mt-auto pt-6 border-t border-white/5">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-mono font-black text-white hover:text-primary-light transition-all group/link"
                    >
                        <span>DEPLOY_LINK</span>
                        <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-mono font-black text-gray-500 hover:text-white transition-all group/link"
                    >
                        <span>SOURCE_REPO</span>
                        <Github className="w-3 h-3 transition-transform group-hover/link:rotate-12" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = ({ projects, profile }) => {
    const defaultProjects = [
        {
            title: "Neural Vision AI",
            description: "Advanced image synthesization engine utilizing generative adversarial networks for high-fidelity content creation.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            tags: ["GAN", "PyTorch", "React", "AWS"],
            liveUrl: "#",
            githubUrl: "#"
        },
        {
            title: "Cyber Flux Dashboard",
            description: "High-throughput analytics interface with real-time telemetry processing and aesthetic-driven data visualization.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
            tags: ["D3.js", "Socket.io", "Tailwind", "Next.js"],
            liveUrl: "#",
            githubUrl: "#"
        },
        {
            title: "Omni-Chain Protocol",
            description: "Decentralized transaction framework optimized for cross-platform integration and low-latency validation.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            tags: ["Solidity", "Ether.js", "Firebase", "TypeScript"],
            liveUrl: "#",
            githubUrl: "#"
        }
    ];

    const displayProjects = projects || defaultProjects;

    return (
        <section id="projects" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20">
                    <div className="font-mono text-[10px] text-primary tracking-[0.4em] mb-4 uppercase">PROJECT_ARCHIVE // 01</div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            {/* Dynamic Heading Logic */}
                            {(() => {
                                const projectsTitle = profile?.projectsTitle || "DEPLOYED MODULES";
                                const titleParts = projectsTitle.split(' ');
                                const mainTitle = titleParts.slice(0, -1).join(' ');
                                const lastWord = titleParts[titleParts.length - 1];

                                return (
                                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
                                        {mainTitle} <span className="text-gradient">{lastWord}</span>
                                    </h2>
                                );
                            })()}
                            <p className="text-gray-400 text-lg font-light leading-relaxed">
                                {profile?.projectsSubtitle || "A curated selection of high-impact systems, designed with scalability and high-fidelity aesthetics in mind. Each module represents a milestone in technical execution."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProjects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
