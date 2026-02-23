import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Github,
    Linkedin,
    Twitter,
    Save,
    Globe,
    Eye,
    EyeOff,
    ExternalLink,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const SocialProfilesManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        github: '',
        linkedin: '',
        twitter: '',
        isGithubVisible: true,
        isLinkedinVisible: true,
        isTwitterVisible: false
    });

    useEffect(() => {
        fetchSocialConfigs();
    }, []);

    const fetchSocialConfigs = async () => {
        try {
            const docRef = doc(db, 'settings', 'socials');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data());
            }
        } catch (error) {
            console.error("Error fetching social configs:", error);
            toast.error("Failed to load social profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await setDoc(doc(db, 'settings', 'socials'), {
                ...formData,
                updatedAt: serverTimestamp()
            });
            toast.success("Social profiles updated successfully!");
        } catch (error) {
            console.error("Error updating social profiles:", error);
            toast.error(`Sync failed: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const toggleVisibility = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Social <span className="text-gray-500 font-normal">Profiles</span></h1>
                <p className="text-gray-400 mt-2">Manage your professional social links and their visibility on the portfolio.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-3xl border border-white/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* GitHub */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <Github size={18} className="text-white" />
                                        GitHub Profile URL
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('isGithubVisible')}
                                        className={`flex items-center gap-2 text-xs font-mono transition-colors ${formData.isGithubVisible ? 'text-primary' : 'text-gray-500'}`}
                                    >
                                        {formData.isGithubVisible ? (
                                            <><Eye size={14} /> VISIBLE</>
                                        ) : (
                                            <><EyeOff size={14} /> HIDDEN</>
                                        )}
                                    </button>
                                </div>
                                <input
                                    type="url"
                                    value={formData.github}
                                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                    placeholder="https://github.com/yourusername"
                                    className="input-glass w-full"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <Linkedin size={18} className="text-[#0077b5]" />
                                        LinkedIn Profile URL
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('isLinkedinVisible')}
                                        className={`flex items-center gap-2 text-xs font-mono transition-colors ${formData.isLinkedinVisible ? 'text-primary' : 'text-gray-500'}`}
                                    >
                                        {formData.isLinkedinVisible ? (
                                            <><Eye size={14} /> VISIBLE</>
                                        ) : (
                                            <><EyeOff size={14} /> HIDDEN</>
                                        )}
                                    </button>
                                </div>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/yourusername"
                                    className="input-glass w-full"
                                />
                            </div>

                            {/* Twitter (Future Ready) */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <Twitter size={18} className="text-[#1da1f2]" />
                                        Twitter (X) Profile URL
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => toggleVisibility('isTwitterVisible')}
                                        className={`flex items-center gap-2 text-xs font-mono transition-colors ${formData.isTwitterVisible ? 'text-primary' : 'text-gray-500'}`}
                                    >
                                        {formData.isTwitterVisible ? (
                                            <><Eye size={14} /> VISIBLE</>
                                        ) : (
                                            <><EyeOff size={14} /> HIDDEN</>
                                        )}
                                    </button>
                                </div>
                                <input
                                    type="url"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    placeholder="https://twitter.com/yourusername"
                                    className="input-glass w-full"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    {saving ? 'SAVING_CHANGES...' : 'SAVE_PROFILES'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Live Preview Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe size={20} className="text-primary" />
                        Live Preview
                    </h2>

                    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-primary/5 space-y-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-mono underline decoration-primary/50 underline-offset-4">Hero Section Preview</p>
                            <div className="flex gap-4 justify-center">
                                {formData.isGithubVisible && formData.github && (
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white">
                                        <Github size={20} />
                                    </div>
                                )}
                                {formData.isLinkedinVisible && formData.linkedin && (
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-full text-[#0077b5]">
                                        <Linkedin size={20} />
                                    </div>
                                )}
                                {formData.isTwitterVisible && formData.twitter && (
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-full text-[#1da1f2]">
                                        <Twitter size={20} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-mono underline decoration-primary/50 underline-offset-4">Footer Preview</p>
                            <div className="flex gap-4 justify-center">
                                {formData.isGithubVisible && formData.github && <Github size={16} className="text-gray-400" />}
                                {formData.isLinkedinVisible && formData.linkedin && <Linkedin size={16} className="text-gray-400" />}
                                {formData.isTwitterVisible && formData.twitter && <Twitter size={16} className="text-gray-400" />}
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                            <AlertCircle size={18} className="text-yellow-500 shrink-0" />
                            <p className="text-[10px] text-yellow-500/80 leading-relaxed font-mono uppercase">
                                Links must start with http:// or https:// to work correctly on the public site.
                            </p>
                        </div>

                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex gap-3">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            <p className="text-[10px] text-green-500/80 leading-relaxed font-mono uppercase">
                                Visibility toggles allow you to quickly hide profiles without deleting URLs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialProfilesManagement;
