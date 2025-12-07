import React, { useState } from 'react';
import { createEnquiry } from '@/services/enquiries';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createEnquiry(formData);
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="bg-white min-h-screen pt-24">
            {/* Header - Simple and Clean */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Contact Us</h1>
                <p className="text-sm text-gray-500">We'd love to hear from you.</p>
            </div>

            <div className="layout-container pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                    {/* Info */}
                    <div className="space-y-8 pt-4">
                        <div className="space-y-6 text-gray-600">
                            <div className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wider">Visit Us</p>
                                    <a>
                                        <p className="text-sm leading-relaxed">
                                        Building No./Flat No.: R. No. 6/1 Andheri Kurla Road<br />
                                        Behind NandJyot Industrial Estate Saki Naka<br />
                                        Mumbai Maharashtra PIN Code: 400072
                                    </p>
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wider">Call Us</p>
                                    <a href="tel:+918108942307"><p className="text-sm">+91 81089 42307</p></a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wider">Email Us</p>
                                    <a href="mailto:silvercrowncreation016@gmail.com"><p className="text-sm">silvercrowncreation016@gmail.com</p></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-lg">
                        <h3 className="text-lg font-serif font-bold mb-6">Send an Enquiry</h3>

                        {success ? (
                            <div className="bg-green-50 text-green-800 p-6 text-center rounded">
                                <p className="font-medium mb-2">Message Sent!</p>
                                <p className="text-sm">We will get back to you shortly.</p>
                                <button onClick={() => setSuccess(false)} className="mt-4 text-xs underline text-green-700">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="pt-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300 resize-none"
                                        placeholder="Type your message here..."
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-secondary transition-all disabled:opacity-70 mt-2"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
