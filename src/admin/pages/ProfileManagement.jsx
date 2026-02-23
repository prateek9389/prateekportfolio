import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    User,
    MapPin,
    Mail,
    Phone,
    Layout,
    Info,
    ExternalLink,
    Code,
    Briefcase
} from 'lucide-react';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { uploadToCloudinary } from '../../utils/cloudinary';
import toast from 'react-hot-toast';
import { Upload, Image as ImageIcon, X, FileText, Download } from 'lucide-react';

const ProfileManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        aboutTitle: '',
        aboutText1: '',
        aboutText2: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        projectsCount: '',
        profileImage: '',
        resumeUrl: '',
        resumeImageUrl: '',
        skillsTitle: '',
        skillsSubtitle: '',
        projectsTitle: '',
        projectsSubtitle: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeImageFile, setResumeImageFile] = useState(null);
    const [resumeImagePreview, setResumeImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const docRef = doc(db, 'settings', 'profile');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData(data);
                if (data.profileImage) setImagePreview(data.profileImage);
                if (data.resumeImageUrl) setResumeImagePreview(data.resumeImageUrl);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile settings. Check Firestore permissions.");
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

    const handleResumeImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = formData.profileImage;
            let resumeUrl = formData.resumeUrl;
            let resumeImageUrl = formData.resumeImageUrl;

            if (imageFile) {
                console.log("Starting image upload to Cloudinary...");
                imageUrl = await uploadToCloudinary(imageFile);
                console.log("Cloudinary image upload successful:", imageUrl);
            }

            if (resumeFile) {
                console.log("Starting resume upload to Cloudinary...");
                // We use 'raw' for PDFs to ensure Cloudinary doesn't try to process them as images
                resumeUrl = await uploadToCloudinary(resumeFile, 'raw');
                console.log("Cloudinary resume upload successful:", resumeUrl);
            }

            if (resumeImageFile) {
                console.log("Starting resume image upload to Cloudinary...");
                resumeImageUrl = await uploadToCloudinary(resumeImageFile);
                console.log("Cloudinary resume image upload successful:", resumeImageUrl);
            }

            const updatedData = {
                ...formData,
                profileImage: imageUrl,
                resumeUrl: resumeUrl,
                resumeImageUrl: resumeImageUrl,
                updatedAt: serverTimestamp()
            };

            console.log("Saving data to Firestore...");
            await setDoc(doc(db, 'settings', 'profile'), updatedData);

            setFormData(updatedData);
            setImageFile(null);
            setResumeFile(null);
            setResumeImageFile(null);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error("Full Sync Error details:", error);
            toast.error(`Sync failed: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };
    const getDownloadUrl = (url) => {
        if (!url) return null;
        if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
            return url.replace('/image/upload/', '/image/upload/fl_attachment/');
        }
        return url;
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Profile <span className="text-gray-500 font-normal">& About</span></h1>
                    <p className="text-gray-400 mt-2">Update your personal information and section content.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hero Section Editing */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Hero Section</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-4 py-4 border-b border-white/5 mb-4">
                                <div
                                    onClick={() => document.getElementById('profile-img-upload').click()}
                                    className="relative w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden group"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon size={32} className="text-gray-600 mx-auto mb-1" />
                                            <span className="text-[10px] text-gray-600 uppercase font-mono">Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="profile-img-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-[10px] text-gray-500 font-mono">RECOMMENDED: 1:1 RATIO (SQUARE)</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Display Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Hero Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="input-glass h-24 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
                                <Info size={20} />
                            </div>
                            <h2 className="text-xl font-bold">About Section</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">About Title</label>
                                <input
                                    type="text"
                                    value={formData.aboutTitle}
                                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Paragraph 1</label>
                                <textarea
                                    value={formData.aboutText1}
                                    onChange={(e) => setFormData({ ...formData, aboutText1: e.target.value })}
                                    className="input-glass h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Paragraph 2</label>
                                <textarea
                                    value={formData.aboutText2}
                                    onChange={(e) => setFormData({ ...formData, aboutText2: e.target.value })}
                                    className="input-glass h-32 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                                <Code size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Skills Section Header</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Skills Section Title</label>
                                <input
                                    type="text"
                                    value={formData.skillsTitle}
                                    onChange={(e) => setFormData({ ...formData, skillsTitle: e.target.value })}
                                    className="input-glass"
                                    placeholder="e.g. SYSTEM PROWESS"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Skills Section Subtitle</label>
                                <textarea
                                    value={formData.skillsSubtitle}
                                    onChange={(e) => setFormData({ ...formData, skillsSubtitle: e.target.value })}
                                    className="input-glass h-24 resize-none"
                                    placeholder="e.g. Mapping the technical architecture..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary-light">
                                <Briefcase size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Projects Section Header</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Projects Section Title</label>
                                <input
                                    type="text"
                                    value={formData.projectsTitle}
                                    onChange={(e) => setFormData({ ...formData, projectsTitle: e.target.value })}
                                    className="input-glass"
                                    placeholder="e.g. DEPLOYED MODULES"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Projects Section Subtitle</label>
                                <textarea
                                    value={formData.projectsSubtitle}
                                    onChange={(e) => setFormData({ ...formData, projectsSubtitle: e.target.value })}
                                    className="input-glass h-24 resize-none"
                                    placeholder="e.g. A curated selection of high-impact systems..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Stats Section Editing */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent-violet/10 rounded-lg text-accent-violet">
                                <Mail size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Contact Info</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Public Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-glass"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Stats & Metrics</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Experience</label>
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="input-glass"
                                    placeholder="5+"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400 mb-2 block">Projects Count</label>
                                <input
                                    type="text"
                                    value={formData.projectsCount}
                                    onChange={(e) => setFormData({ ...formData, projectsCount: e.target.value })}
                                    className="input-glass"
                                    placeholder="50+"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Resume / CV</h2>
                        </div>

                        <div className="space-y-4">
                            {/* PDF Uploder */}
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${resumeFile ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${resumeFile ? 'bg-primary/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Resume PDF</p>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-[10px] uppercase font-mono ${resumeFile ? 'text-primary-light font-bold' : 'text-gray-500'}`}>
                                                {resumeFile ? resumeFile.name : (formData.resumeUrl ? 'PDF Active' : 'No PDF Uploaded')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('resume-upload').click()}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary-light"
                                        disabled={saving}
                                    >
                                        <Upload size={20} />
                                    </button>
                                </div>
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                    className="hidden"
                                />
                            </div>

                            {/* Image Uploader */}
                            <div className={`flex flex-col gap-4 p-4 rounded-xl border transition-all duration-300 ${resumeImageFile ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${resumeImageFile ? 'bg-primary/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                                            <ImageIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Resume Image Preview</p>
                                            <p className={`text-[10px] uppercase font-mono ${resumeImageFile ? 'text-primary-light font-bold' : 'text-gray-500'}`}>
                                                {resumeImageFile ? resumeImageFile.name : (formData.resumeImageUrl ? 'Image Active' : 'No Image Uploaded')}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('resume-image-upload').click()}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary-light"
                                        disabled={saving}
                                    >
                                        <Upload size={20} />
                                    </button>
                                    <input
                                        id="resume-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleResumeImageChange}
                                        className="hidden"
                                    />
                                </div>

                                {resumeImagePreview && (
                                    <div className="relative aspect-[3/4] w-full bg-black/20 rounded-lg overflow-hidden border border-white/10">
                                        <img src={resumeImagePreview} alt="Resume Preview" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => {
                                                setResumeImageFile(null);
                                                setResumeImagePreview(formData.resumeImageUrl || null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {formData.resumeUrl && (
                                    <a
                                        href={getDownloadUrl(formData.resumeUrl)}
                                        download="Resume"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-[10px] font-mono text-gray-400 hover:text-white"
                                    >
                                        <Download size={14} />
                                        PDF
                                    </a>
                                )}
                                {formData.resumeImageUrl && (
                                    <a
                                        href={getDownloadUrl(formData.resumeImageUrl)}
                                        download="Resume"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-[10px] font-mono text-gray-400 hover:text-white"
                                    >
                                        <ImageIcon size={14} />
                                        IMAGE
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl bg-primary/5 border-primary/20">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <ExternalLink size={16} />
                            Quick Preview
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">These changes will reflect on your public home page immediately after saving.</p>
                        <div className="p-4 rounded-xl bg-black/40 space-y-2">
                            <h4 className="text-lg font-bold text-white">{formData.name}</h4>
                            <p className="text-sm text-primary-light">{formData.title}</p>
                            <p className="text-[10px] text-gray-400 italic line-clamp-2">"{formData.bio}"</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileManagement;
