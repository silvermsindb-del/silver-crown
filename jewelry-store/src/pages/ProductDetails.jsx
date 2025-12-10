import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/products';
import Image from '@/components/common/Image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Check, Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';


const serializeRichText = (nodes) => {
    if (!nodes) return null;
    return nodes.map((node, i) => {
        if (node.text) {
            let text = node.text;
            if (node.bold) text = <strong key={i}>{text}</strong>;
            if (node.code) text = <code key={i}>{text}</code>;
            if (node.italic) text = <em key={i}>{text}</em>;
            return <span key={i}>{text}</span>;
        }

        if (!node) return null;

        switch (node.type) {
            case 'h1':
                return <h1 key={i} className="text-2xl font-bold mb-2">{serializeRichText(node.children)}</h1>;
            case 'h2':
                return <h2 key={i} className="text-xl font-bold mb-2">{serializeRichText(node.children)}</h2>;
            case 'h3':
                return <h3 key={i} className="text-lg font-bold mb-2">{serializeRichText(node.children)}</h3>;
            case 'ul':
                return <ul key={i} className="list-disc pl-5 mb-4">{serializeRichText(node.children)}</ul>;
            case 'ol':
                return <ol key={i} className="list-decimal pl-5 mb-4">{serializeRichText(node.children)}</ol>;
            case 'li':
                return <li key={i}>{serializeRichText(node.children)}</li>;
            case 'link':
                return <a key={i} href={node.url} className="text-primary underline">{serializeRichText(node.children)}</a>;
            default:
                return <p key={i} className="mb-4">{serializeRichText(node.children)}</p>;
        }
    });
};

const DescriptionSection = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    // Safely get text content
    const getContent = () => {
        if (!description) return "No description available.";
        if (typeof description === 'string') return description;
        if (typeof description === 'object' && description.root && description.root.children) {
            return serializeRichText(description.root.children);
        }
        return "No description available.";
    };

    const content = getContent();

    return (
        <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-100 pb-2">Description</h3>
            <div className={`prose prose-sm text-gray-600 leading-relaxed transition-all duration-500 overflow-hidden break-words ${expanded ? 'max-h-[2000px]' : 'max-h-[100px] relative'}`}>
                {content}
                {!expanded && <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />}
            </div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-bold uppercase tracking-widest text-primary mt-2 border-b border-primary hover:text-secondary hover:border-secondary transition-colors"
            >
                {expanded ? 'Close' : 'Read More'}
            </button>
        </div>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { addToCart } = useCart();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id)
    });

    const handleAddToCart = () => {
        addToCart(product);
        setShowSuccessModal(true);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name || product.title,
                    text: `Check out this amazing ${product.name || product.title} from Silver Crown!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-gray-500">Loading details...</div>;
    if (error || !product) return <div className="min-h-screen pt-32 text-center text-red-500">Product not found.</div>;

    // Normalize images - Payload 'upload' hasMany: true returns array of objects
    const rawImages = product.images || [];
    const images = rawImages.map(img => {
        const url = img?.cloudinary?.secure_url || img?.url;
        return url && !url.startsWith('http')
            ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`
            : url;
    }).filter(Boolean);

    // Fallback image
    if (images.length === 0) {
        images.push('https://via.placeholder.com/600x800?text=No+Image');
    }

    // Render description safely
    const renderDescription = () => {
        if (typeof product.description === 'string') return <p>{product.description}</p>;
        if (typeof product.description === 'object' && product.description?.root) {
            // Basic extraction if rich text logic isn't fully implemented
            return <div className="italic text-gray-500">View details in store.</div>;
        }
        return <p className="text-gray-400">No description available.</p>;
    };

    return (
        <div className="bg-white min-h-screen relative">
            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowSuccessModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white p-8 md:p-10 rounded-lg shadow-2xl relative z-60 max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">Added to Cart!</h3>
                            <p className="text-gray-500 mb-8 text-sm">
                                <span className="font-bold text-gray-800">{product.name || product.title}</span> has been added to your shopping bag.
                            </p>

                            <div className="space-y-3">
                                <Link
                                    to="/cart"
                                    className="block w-full bg-stone-900 text-white py-3 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors"
                                >
                                    View Cart & Checkout
                                </Link>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="block w-full border border-gray-200 text-gray-600 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 py-4 mt-20 md:mt-28 lg:mt-24">
                <div className="layout-container text-xs md:text-sm text-gray-500 flex items-center space-x-2 uppercase tracking-wide">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 truncate max-w-xs font-medium">{product.name || product.title}</span>
                </div>
            </div>

            <div className="layout-container py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <div className="space-y-4 md:sticky top-24 h-fit">
                        <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative group rounded-sm shadow-sm">
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full"
                            >
                                <Image
                                    src={images[selectedImageIndex]}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                                    priority
                                />
                            </motion.div>
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`aspect-square overflow-hidden border transition-all ${selectedImageIndex === idx ? 'border-primary opacity-100 ring-1 ring-primary' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                                    >
                                        <Image src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="md:pl-4 lg:pl-8">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 capitalize"
                        >
                            {product.name || product.title}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-serif text-primary mb-8 border-b pb-6 border-gray-100"
                        >
                            {formatCurrency(product.price)}
                        </motion.p>

                        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                            {product.material && (
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-widest text-[10px] mb-1">Material</span>
                                    <span className="font-medium capitalize">{product.material.replace('_', ' ')}</span>
                                </div>
                            )}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <span className="block text-gray-500 uppercase tracking-widest text-[10px] mb-1">Available Sizes</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(s => (
                                            <span key={s} className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">{s.replace('_', ' ')}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description with Read More */}
                        <DescriptionSection description={product.description} />

                        <div className="space-y-6 pt-6 mt-6 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium uppercase tracking-widest text-gray-500">Availability:</span>
                                {product.stock > 0 ? (
                                    <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        In Stock ({product.stock} items)
                                    </span>
                                ) : (
                                    <span className="text-sm text-red-600 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock || product.stock <= 0}
                                className={`w-full text-white py-4 font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm transform ${(!product.stock || product.stock <= 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-secondary hover:shadow-lg active:scale-95'}`}
                            >
                                <ShoppingBag size={20} />
                                <span>{(!product.stock || product.stock <= 0) ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full bg-white border border-gray-200 text-gray-900 py-4 font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-50 active:scale-95"
                            >
                                <Share2 size={20} />
                                <span>Share Product</span>
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                                Free shipping on orders over {formatCurrency(5000)}.<br />
                                30-day return policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
