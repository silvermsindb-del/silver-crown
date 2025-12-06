import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import Image from '@/components/common/Image';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const getImageUrl = (item) => {
        const imageObj = item.images?.[0];
        const url = imageObj?.cloudinary?.secure_url || imageObj?.url || item.image?.url;
        return url && !url.startsWith('http')
            ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`
            : url;
    };

    if (cart.length === 0) {
        return (
            <div className="layout-container py-32 text-center min-h-[60vh] flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <ShoppingBag size={32} />
                </div>
                <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
                <p className="mb-8 text-gray-500 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Browse our collection to find your perfect piece.</p>
                <Link to="/shop" className="bg-primary text-white px-10 py-4 uppercase tracking-widest hover:bg-secondary transition-colors text-sm font-medium">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="layout-container">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-center md:text-left">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-8">
                        <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                            {cart.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 last:border-0 py-6 first:pt-0 last:pb-0">
                                    <div className="w-full sm:w-28 h-32 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                                        <Image
                                            src={getImageUrl(item)}
                                            className="w-full h-full object-cover"
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-lg text-gray-900">{item.name || item.title}</h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.category?.name || 'Jewelry'}</p>
                                            </div>
                                            <p className="font-semibold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-200 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/shop" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 p-8 rounded-lg sticky top-32">
                            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-900">Order Summary</h3>
                            <div className="space-y-4 mb-8 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="block w-full bg-stone-900 text-white text-center py-4 uppercase tracking-[0.15em] hover:bg-secondary transition-colors text-sm font-bold shadow-lg shadow-stone-900/20"
                            >
                                Proceed to Checkout
                            </Link>
                            <p className="text-xs text-gray-400 text-center mt-4">Secure Checkout &ndash; 100% Satisfaction Guarantee</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Need access to ShoppingBag component, it was not imported in original snippet but used in Empty state
import { ShoppingBag } from 'lucide-react';

export default Cart;
