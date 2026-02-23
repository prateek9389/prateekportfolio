import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit3,
    X,
    Code
} from 'lucide-react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

const SkillsManagement = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        level: 80,
        category: 'Programming Languages'
    });

    const categories = ['Programming Languages', 'Frontend', 'Backend', 'Tools & Tech', 'Mobile', 'Design', 'Other'];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'skills'), orderBy('category', 'asc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSkills(data);
        } catch (error) {
            console.error("Error fetching skills:", error);
            toast.error("Failed to load skills");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingSkill) {
                await updateDoc(doc(db, 'skills', editingSkill.id), formData);
                toast.success('Skill updated!');
            } else {
                await addDoc(collection(db, 'skills'), formData);
                toast.success('Skill added!');
            }
            closeModal();
            fetchSkills();
        } catch (error) {
            console.error("Error saving skill:", error);
            toast.error(`Database Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this skill?')) {
            try {
                await deleteDoc(doc(db, 'skills', id));
                toast.success('Skill deleted');
                fetchSkills();
            } catch (error) {
                toast.error('Failed to delete skill');
            }
        }
    };

    const openModal = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({
                name: skill.name,
                level: skill.level,
                category: skill.category
            });
        } else {
            setEditingSkill(null);
            setFormData({
                name: '',
                level: 80,
                category: 'Programming Languages'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSkill(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage <span className="text-gray-500 font-normal">Skills</span></h1>
                    <p className="text-gray-400 mt-2">Update your proficiency levels and add new technologies.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && !isModalOpen ? (
                    <div className="col-span-full flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    skills.map((skill) => (
                        <div key={skill.id} className="glass-card p-6 rounded-2xl flex items-center justify-between group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                                        <Code size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{skill.name}</h3>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{skill.category}</span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${skill.level}%` }} />
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                <button onClick={() => openModal(skill)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(skill.id)} className="p-2 hover:bg-red-400/10 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-md rounded-3xl overflow-hidden z-10 p-8 relative"
                        >
                            <h2 className="text-2xl font-bold mb-6">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-400 mb-2 block">Skill Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-glass"
                                        placeholder="React, TypeScript, etc."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-400 mb-2 block">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-glass bg-[#1a1a2e]"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-gray-400">Proficiency Level</label>
                                        <span className="text-sm font-bold text-primary-light">{formData.level}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={closeModal} className="px-6 py-2 rounded-xl hover:bg-white/5 transition-all">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary">
                                        {editingSkill ? 'Update' : 'Add'} Skill
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SkillsManagement;
