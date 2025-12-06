import React from 'react';
import { Link } from 'react-router-dom';
import Image from '@/components/common/Image';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

const ProductCard = ({ product }) => {
    // Safely handle images
    const imageObj = product.images?.[0];
    const imageUrl = imageObj?.cloudinary?.secure_url || imageObj?.url;

    // Secondary Image for Hover Effect
    const imageObjHover = product.images?.[1];
    const hoverImageUrl = imageObjHover?.cloudinary?.secure_url || imageObjHover?.url;

    // Helper for URLs
    const getUrl = (url) => url && !url.startsWith('http')
        ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`
        : url;

    const finalImageUrl = getUrl(imageUrl);
    const finalHoverUrl = getUrl(hoverImageUrl);

    return (
        <div className="group/card relative hover:z-30 transition-all duration-300">
            {/* Card Container */}
            <Link to={`/product/${product.id}`} className="block h-full flex flex-col">

                {/* Image Wrap */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-2xl">

                    {/* Badge */}
                    {product.isFeatured && (
                        <span className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest px-2 py-1 text-stone-900 border border-stone-200 rounded-sm">
                            Featured
                        </span>
                    )}

                    {/* Main Image */}
                    <Image
                        src={finalImageUrl}
                        alt={product.name || product.title}
                        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${finalHoverUrl ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-105'}`}
                    />

                    {/* Secondary Image (Fade In) */}
                    {finalHoverUrl && (
                        <Image
                            src={finalHoverUrl}
                            alt={product.name || product.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover/card:opacity-100 group-hover/card:scale-105"
                        />
                    )}

                    {/* Wishlist Button (Corner) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            // Wishlist logic here
                        }}
                        className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover/card:opacity-100 translate-x-2 group-hover/card:translate-x-0 duration-300"
                        title="Add to Wishlist"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5 4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>

                    {/* Quick View / Add Button Overlay (Desktop) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 hidden md:block">
                        <button className="w-full bg-white text-stone-900 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors shadow-lg border border-stone-100 rounded-xl">
                            View Details
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow text-center px-1">
                    {product.category && (
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
                            {product.category.name || product.category.title}
                        </p>
                    )}
                    <h3 className="text-base font-serif font-medium text-stone-900 mb-1 group-hover/card:text-primary transition-colors line-clamp-1">
                        {product.name || product.title}
                    </h3>
                    <p className="text-sm font-bold text-stone-900 mb-3">
                        {formatCurrency(product.price)}
                    </p>

                    {/* Mobile Only Button (Visible always on touch devices) */}
                    <div className="md:hidden mt-auto">
                        <button className="w-full bg-stone-900 text-white py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl">
                            Details
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
