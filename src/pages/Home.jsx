import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

import Navbar from '../components/common/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import About from '../components/About';
import Contact from '../components/Contact';
import FloatingSocialBar from '../components/FloatingSocialBar';
import SocialLinks from '../components/SocialLinks';

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Projects
                const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
                const projectsSnap = await getDocs(qProjects);
                const projectsData = projectsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProjects(projectsData);

                // Fetch Skills and group by category
                const qSkills = query(collection(db, 'skills'), orderBy('category', 'asc'));
                const skillsSnap = await getDocs(qSkills);
                const skillsData = skillsSnap.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    if (!acc[data.category]) acc[data.category] = [];
                    acc[data.category].push({ name: data.name, level: data.level });
                    return acc;
                }, {});
                setSkills(Object.keys(skillsData).length > 0 ? skillsData : null);

                // Fetch Profile Settings
                const profileDoc = await getDoc(doc(db, 'settings', 'profile'));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="relative bg-[#030014]">
            {/* Global AI Background Elements */}
            <div className="fixed inset-0 grid-background opacity-20 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent ai-scan-line" />

            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-primary to-accent-violet z-[100] origin-left shadow-[0_0_10px_#6366f1]"
                style={{ scaleX }}
            />

            <Navbar />
            <FloatingSocialBar />

            <main className="relative z-10">
                {loading ? (
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                ) : (
                    <>
                        <Hero profile={profile} />

                        <div className="relative">
                            {/* Background Decorative Elements */}
                            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
                            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-accent-violet/5 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />

                            <Projects projects={projects.length > 0 ? projects : null} profile={profile} />
                            <Skills skills={skills} profile={profile} />
                            <About profile={profile} />
                            <Contact profile={profile} />
                        </div>
                    </>
                )}
            </main>

            <footer className="relative z-10 py-8 md:py-12 border-t border-white/5 text-center bg-[#030014]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-6 md:mb-8">
                        <SocialLinks variant="footer" />
                    </div>
                    <p className="font-mono text-[8px] sm:text-[10px] text-gray-500 tracking-[0.2em] sm:tracking-[0.3em] mb-4 uppercase">
                        System status: <span className="text-accent-cyan">OPERATIONAL</span> // Latency: <span className="text-accent-cyan">14ms</span>
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm font-light">
                        © {new Date().getFullYear()} <span className="text-white font-bold tracking-tighter">PORTFOLIO</span>.
                        Built with <span className="text-primary-light">React</span> & <span className="text-primary-light">Firebase</span>.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
