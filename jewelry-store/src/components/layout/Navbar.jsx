import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react';
import clsx from 'clsx';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav
            className={clsx(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm py-3"
            )}
        >
            <div className="layout-container flex items-center justify-between relative">
                <div className="flex justify-center lg:justify-start">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img src="/logo.png" alt="Silver Crown Creation" className="h-10 md:h-14 w-auto" />
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => clsx(
                                "text-xs font-bold uppercase tracking-[0.15em] transition-colors relative",
                                isActive || (link.path !== '/' && location.pathname.startsWith(link.path))
                                    ? "text-secondary"
                                    : "text-gray-800 hover:text-secondary"
                            )}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="relative group">
                        <button
                            className="p-2 hover:text-secondary transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search size={18} />
                        </button>
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.form
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: '220px' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="absolute right-0 top-full mt-2 bg-white shadow-lg overflow-hidden rounded border border-gray-100"
                                    onSubmit={handleSearch}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full px-4 py-2 text-xs outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link to="/wishlist" className="p-2 hover:text-secondary transition-colors hidden sm:block">
                        <Heart size={18} />
                    </Link>
                    <Link to="/cart" className="p-2 hover:text-secondary transition-colors relative">
                        <ShoppingBag size={18} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-secondary text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile" className="p-2 hover:text-secondary transition-colors hidden sm:block">
                        <User size={18} />
                    </Link>

                    <button
                        className="md:hidden p-2 hover:text-secondary transition-colors z-[110] relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-[60px] bg-white z-[90] flex flex-col p-6 overflow-y-auto h-[calc(100vh-60px)] shadow-xl"
                    >
                        <form onSubmit={handleSearch} className="relative mb-8 flex-shrink-0">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full border-b border-gray-200 py-3 pl-8 text-sm outline-none focus:border-secondary transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                        </form>

                        <div className="flex flex-col space-y-6 text-center">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx("text-xl font-serif font-bold uppercase tracking-wider", isActive ? "text-secondary" : "text-gray-900")}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <div className="h-px bg-gray-100 w-20 mx-auto my-4" />
                            <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-500">My Account</NavLink>
                            <NavLink to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-500">Wishlist</NavLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
