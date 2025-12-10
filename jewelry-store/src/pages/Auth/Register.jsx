import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { getFriendlyErrorMessage } from '@/lib/utils';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await register(email, password, name);
            navigate('/login');
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-stone-50">
            <div className="bg-white p-8 md:p-12 shadow-lg rounded-sm w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">Create Account</h1>
                    <p className="text-gray-500 text-sm">Join Silver Crown Creation</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-4 mb-6 rounded border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-200 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-200 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-200 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white"
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-200 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50 focus:bg-white"
                                placeholder="Re-enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-sm hover:shadow-md disabled:opacity-70"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Already have an account? <Link to="/login" className="text-primary hover:text-secondary font-medium underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
