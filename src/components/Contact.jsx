import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const Contact = ({ profile }) => {
    const defaultData = {
        email: 'hello@johndoe.com',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA'
    };

    const data = profile || defaultData;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                createdAt: serverTimestamp(),
                read: false
            });
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Get In <span className="text-gradient">Touch</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/3 space-y-8"
                    >
                        <div className="glass-card p-8 rounded-2xl flex items-start gap-4">
                            <div className="p-3 bg-primary/20 rounded-xl text-primary-light">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                                <p className="text-gray-400">{data.email}</p>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl flex items-start gap-4">
                            <div className="p-3 bg-accent-cyan/20 rounded-xl text-accent-cyan">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Phone</h4>
                                <p className="text-gray-400">{data.phone}</p>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-2xl flex items-start gap-4">
                            <div className="p-3 bg-accent-violet/20 rounded-xl text-accent-violet">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Location</h4>
                                <p className="text-gray-400">{data.location}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-2/3"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 md:p-12 rounded-3xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-glass"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-glass"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input-glass"
                                    placeholder="Inquiry about new project"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="input-glass resize-none"
                                    placeholder="How can I help you?"
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
