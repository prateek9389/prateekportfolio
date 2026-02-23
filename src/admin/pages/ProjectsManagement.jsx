import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    ExternalLink,
    Image as ImageIcon,
    X,
    Upload,
    Briefcase
} from 'lucide-react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { uploadToCloudinary } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const ProjectsManagement = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        liveUrl: '',
        githubUrl: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = editingProject?.image || '';

            if (imageFile) {
                console.log("Starting image upload to Cloudinary...");
                imageUrl = await uploadToCloudinary(imageFile);
            }

            const projectData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                image: imageUrl,
                updatedAt: serverTimestamp(),
            };

            if (editingProject) {
                await updateDoc(doc(db, 'projects', editingProject.id), projectData);
                toast.success('Project updated successfully!');
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    createdAt: serverTimestamp(),
                });
                toast.success('Project added successfully!');
            }

            closeModal();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error(`Database Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', id));
                toast.success('Project deleted successfully');
                fetchProjects();
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
                liveUrl: project.liveUrl || '',
                githubUrl: project.githubUrl || '',
            });
            setImagePreview(project.image);
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                tags: '',
                liveUrl: '',
                githubUrl: '',
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setImagePreview(null);
        setImageFile(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage <span className="text-gray-500 font-normal">Projects</span></h1>
                    <p className="text-gray-400 mt-2">Add, edit, or remove projects from your portfolio.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Project
                </motion.button>
            </div>

            {loading && !isModalOpen ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="glass-card rounded-2xl overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={project.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => openModal(project)} className="p-2 bg-black/50 hover:bg-primary transition-colors rounded-lg backdrop-blur-md">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-black/50 hover:bg-red-500 transition-colors rounded-lg backdrop-blur-md">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2">{project.title || 'Untitled Project'}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description || 'No description provided.'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(project.tags) ? project.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 text-[10px] bg-white/5 rounded-full border border-white/5">{tag}</span>
                                    )) : (
                                        <span className="px-2 py-0.5 text-[10px] bg-white/5 rounded-full border border-white/5 text-gray-500">No tags</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card rounded-3xl border border-white/5">
                    <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300">No Projects Yet</h3>
                    <p className="text-gray-500 mt-2">Start by adding your first project to showcase your work.</p>
                    <button
                        onClick={() => openModal()}
                        className="mt-6 px-6 py-2 bg-primary/20 text-primary-light border border-primary/30 rounded-xl hover:bg-primary/30 transition-all font-bold text-sm"
                    >
                        Add Your First Project
                    </button>
                </div>
            )}

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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden z-10 p-8 md:p-10 relative"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-8">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-400 mb-2 block">Project Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="input-glass"
                                                placeholder="My Awesome App"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-400 mb-2 block">Tech Stack (comma separated)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                className="input-glass"
                                                placeholder="React, Firebase, Tailwind"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-400 mb-2 block">Live URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.liveUrl}
                                                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                                    className="input-glass"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-400 mb-2 block">GitHub URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.githubUrl}
                                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                                    className="input-glass"
                                                    placeholder="https://github..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Project Image</label>
                                        <div
                                            onClick={() => document.getElementById('image-upload').click()}
                                            className="border-2 border-dashed border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group"
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="text-white w-8 h-8" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="text-gray-500 w-10 h-10 mb-2" />
                                                    <span className="text-xs text-gray-500">Click to upload image</span>
                                                </>
                                            )}
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-400 mb-2 block">Description</label>
                                            <textarea
                                                required
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="input-glass h-32 resize-none"
                                                placeholder="Tell about your project..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsManagement;
