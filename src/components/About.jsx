import { motion } from 'framer-motion';

const About = ({ profile }) => {
    const defaultData = {
        aboutTitle: 'Expertise Driven by Passion',
        aboutText1: "With over 5 years of experience in the tech industry, I've had the privilege of working with scaling startups and established enterprises. I specialize in building robust full-stack applications that are not only functional but also deliver exceptional user experiences.",
        aboutText2: "My approach combines clean architecture, modern design principles, and a deep understanding of core technologies to solve complex problems efficiently.",
        experience: '5+',
        projectsCount: '50+'
    };

    const data = profile || defaultData;

    return (
        <section id="about" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-light via-accent-cyan to-accent-violet rounded-full blur-2xl opacity-20 animate-pulse-slow" />
                            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/10 overflow-hidden glass-card p-2">
                                <img
                                    src={data.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            {data.aboutTitle.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{data.aboutTitle.split(' ').pop()}</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            {data.aboutText1}
                        </p>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {data.aboutText2}
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{data.experience}</h4>
                                <p className="text-primary-light font-medium">Experience</p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{data.projectsCount}</h4>
                                <p className="text-primary-light font-medium">Projects Delivered</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
