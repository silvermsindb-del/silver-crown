import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-20 pb-10 border-t border-stone-800">
            <div className="layout-container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Brand */}
                <div className="space-y-6">
                    <Link to="/" className="block">
                        <img src="/logo.png" alt="Silver Crown Creation" className="h-16 w-auto brightness-0 invert" />
                    </Link>
                    <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                        <p>
                            Building No./Flat No.: R. No. 6/1 Andheri Kurla Road <br />
                            Behind NandJyot Industrial Estate Saki Naka <br />
                            Mumbai Maharashtra PIN Code: 400072
                        </p>
                        <p>Phone: +91 81089 42307</p>
                        <p>Email: silvercrowncreation016@gmail.com</p>
                        <p>
                            Working Hours: <br />
                            Monday – Saturday: 08AM – 10PM
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://www.youtube.com/@silvercrowncreation" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors">
                            <Youtube size={18} />
                        </a>
                        <a href="https://www.instagram.com/silvercrowncreation?utm_source=qr&igsh=MThxbnY3YTB0dThnZQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-colors">
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>

                {/* Shop Links */}
                <div>
                    <h4 className="font-serif font-bold text-lg mb-6 tracking-wide">Shop</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                        {/* Dynamic categories if possible, otherwise static as requested */}
                        <li><Link to="/shop?category=necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
                        <li><Link to="/shop?category=rings" className="hover:text-white transition-colors">Rings</Link></li>
                        <li><Link to="/shop?category=earrings" className="hover:text-white transition-colors">Earrings</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4 className="font-serif font-bold text-lg mb-6 tracking-wide">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                        <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="font-serif font-bold text-lg mb-6 tracking-wide">Newsletter</h4>
                    <p className="text-gray-400 text-sm mb-4">Be the first to know about new arrivals and exclusive offers.</p>
                    <form className="space-y-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-stone-800 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-white placeholder-gray-500"
                        />
                        <button className="w-full bg-white text-stone-900 py-3 text-xs uppercase font-bold tracking-widest hover:bg-secondary hover:text-white transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="layout-container border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Silver Crown Creation. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
