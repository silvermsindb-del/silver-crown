import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-stone-50">
            <div className="bg-white p-8 md:p-12 shadow-lg rounded-sm w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-4 mb-6 rounded border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all shadow-sm hover:shadow-md disabled:opacity-70"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Don't have an account? <Link to="/register" className="text-primary hover:text-secondary font-medium underline">Create one</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
