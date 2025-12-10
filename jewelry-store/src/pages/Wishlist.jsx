import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (!wishlist || wishlist.length === 0) {
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
    }

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="layout-container">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Your Wishlist</h1>
                    <p className="text-gray-500">{wishlist.length} item{wishlist.length !== 1 && 's'} saved</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
