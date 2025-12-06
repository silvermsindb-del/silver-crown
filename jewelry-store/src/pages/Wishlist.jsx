import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist = () => {
    // Basic placeholder Wishlist since full backend logic wasn't requested/scoped yet but page must exist
    return (
        <div className="layout-container py-32 text-center min-h-[60vh] flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-400">
                <Heart size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="mb-8 text-gray-500 max-w-md mx-auto">
                Save your favorite items here to check them out later.
            </p>
            <Link to="/shop" className="bg-primary text-white px-10 py-4 uppercase tracking-widest hover:bg-secondary transition-colors text-sm font-medium">
                Start Shopping
            </Link>
        </div>
    );
};

export default Wishlist;
