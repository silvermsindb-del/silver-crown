import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/orders';
import { getShippingMethods } from '@/services/shipping';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, Truck, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Shipping State
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const methods = await getShippingMethods();
                setShippingMethods(methods);
                // Select first one by default if available
                if (methods.length > 0) {
                    setSelectedShippingMethod(methods[0]);
                }
            } catch (err) {
                console.error("Failed to fetch shipping methods", err);
                // Fallback to a default if API fails?
                // For now, list might be empty.
            }
        };
        fetchShippingMethods();
    }, []);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        email: user?.email || '',
        paymentMethod: 'cod'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (cart.length === 0) {
            setError('Your cart is empty.');
            setLoading(false);
            return;
        }

        if (!user) {
            setError('Please login to place an order.');
            setLoading(false);
            // Optionally redirect to login
            return;
        }

        try {
            // Calculate Shipping Cost
            let shippingCost = 0;
            if (selectedShippingMethod) {
                const isFree = selectedShippingMethod.freeShippingThreshold && cartTotal >= selectedShippingMethod.freeShippingThreshold;
                shippingCost = isFree ? 0 : selectedShippingMethod.price;
            }

            const finalTotal = cartTotal + shippingCost;

            const orderPayload = {
                user: user.id,
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: finalTotal,
                shippingCost: shippingCost,
                shippingMethod: selectedShippingMethod?.name || 'Standard',
                status: 'pending',
                shippingAddress: {
                    fullName: formData.fullName,
                    addressLine1: formData.addressLine1,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod
            };

            await createOrder(orderPayload);
            clearCart();
            setShowSuccessModal(true); // Show modal instead of immediate redirect
            // Helper: no navigate(), modal buttons handle it
        } catch (err) {
            console.error(err);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-2xl font-serif font-bold mb-4">Please Login</h2>
                <p className="text-gray-500 mb-6">You need to be logged in to complete your purchase.</p>
                <div className="space-x-4">
                    <Link to="/login" className="bg-primary text-white px-8 py-3 uppercase tracking-widest hover:bg-secondary">Login</Link>
                    <Link to="/register" className="bg-white border border-gray-300 px-8 py-3 uppercase tracking-widest hover:bg-gray-50">Register</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !showSuccessModal) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <p>Your cart is empty.</p>
                <Link to="/shop" className="text-secondary underline mt-4 inline-block">Go Shopping</Link>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24 relative">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 md:p-12 rounded shadow-2xl max-w-md w-full text-center relative overflow-hidden"
                    >
                        {/* Animated Truck Scene */}
                        <div className="relative w-full h-24 mb-6 bg-gray-50 rounded-lg overflow-hidden flex items-end pb-2 border border-gray-100">
                            {/* Road */}
                            <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>

                            {/* Truck Animation */}
                            <motion.div
                                initial={{ x: -100 }}
                                animate={{ x: 300 }}
                                transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                                className="absolute bottom-1"
                            >
                                <Truck className="text-stone-800 w-10 h-10" />
                                {/* Package on Truck */}
                                <motion.div
                                    className="absolute -top-2 left-6 bg-primary w-4 h-4 rounded-sm"
                                    initial={{ y: -10 }}
                                    animate={{ y: 0 }}
                                />
                            </motion.div>

                            {/* Speed Lines/Clouds */}
                            <motion.div
                                animate={{ x: [-20, -100] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="absolute top-4 right-0 flex space-x-4 opacity-30"
                            >
                                <div className="w-8 h-1 bg-gray-300 rounded"></div>
                                <div className="w-12 h-1 bg-gray-300 rounded"></div>
                            </motion.div>
                        </div>

                        <h2 className="text-3xl font-serif font-bold mb-2 text-gray-900">Order Placed!</h2>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-green-600 mb-4">Your Package is on the Move</h4>

                        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                            Thank you for your purchase. We are preparing your order for shipment. Sit tight!
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full bg-stone-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-secondary transition-colors"
                            >
                                View Order
                            </button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="w-full bg-white border border-gray-200 text-gray-900 py-4 font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="layout-container">
                <h1 className="text-3xl font-serif font-bold mb-8 text-center md:text-left">Checkout</h1>
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Form */}
                    <div className="lg:w-2/3 bg-white p-6 md:p-8 shadow-sm rounded-sm">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required disabled />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone</label>
                                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Address</label>
                                <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" placeholder="Street address" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                                    <input name="city" value={formData.city} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                                    <input name="state" value={formData.state} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Postal Code</label>
                                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Country</label>
                                    <input name="country" value={formData.country} onChange={handleChange} className="border border-gray-200 p-3 w-full focus:outline-none focus:border-primary" required readOnly />
                                </div>
                            </div>

                            {/* Shipping Method Section */}
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b mt-10">Shipping Method</h2>
                            <div className="space-y-3">
                                {shippingMethods.length === 0 ? (
                                    <p className="text-sm text-gray-500">Loading shipping options...</p>
                                ) : (
                                    shippingMethods.map((method) => {
                                        const isFree = method.freeShippingThreshold && cartTotal >= method.freeShippingThreshold;
                                        const cost = isFree ? 0 : method.price;

                                        return (
                                            <label key={method.id} className={`flex items-center justify-between p-4 border cursor-pointer hover:border-primary transition-colors ${selectedShippingMethod?.id === method.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        name="shippingMethod"
                                                        value={method.id}
                                                        checked={selectedShippingMethod?.id === method.id}
                                                        onChange={() => setSelectedShippingMethod(method)}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <div>
                                                        <span className="font-medium block text-sm">{method.name}</span>
                                                        <span className="text-xs text-gray-500">{method.duration}</span>
                                                    </div>
                                                </div>
                                                <span className={`font-bold text-sm ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {isFree ? 'FREE' : formatCurrency(cost)}
                                                </span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>

                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b mt-10">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 p-4 border border-gray-200 cursor-pointer hover:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="font-medium">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center space-x-3 p-4 border border-gray-200 cursor-pointer opacity-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={formData.paymentMethod === 'credit_card'}
                                        onChange={handleChange}
                                        disabled
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="font-medium">Credit Card (Coming Soon)</span>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 shadow-sm rounded-sm sticky top-24">
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate w-2/3">{item.name} (x{item.quantity})</span>
                                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={!selectedShippingMethod || (selectedShippingMethod.freeShippingThreshold && cartTotal >= selectedShippingMethod.freeShippingThreshold) ? "text-green-600" : ""}>
                                        {selectedShippingMethod
                                            ? ((selectedShippingMethod.freeShippingThreshold && cartTotal >= selectedShippingMethod.freeShippingThreshold) ? 'Free' : formatCurrency(selectedShippingMethod.price))
                                            : 'Calculating...'}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        {selectedShippingMethod
                                            ? formatCurrency(cartTotal + ((selectedShippingMethod.freeShippingThreshold && cartTotal >= selectedShippingMethod.freeShippingThreshold) ? 0 : selectedShippingMethod.price))
                                            : formatCurrency(cartTotal)}
                                    </span>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-stone-900 text-white py-4 mt-8 uppercase tracking-widest font-bold hover:bg-secondary transition-colors disabled:opacity-70 flex justify-center items-center space-x-2"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                <span>{loading ? 'Processing...' : 'Place Order'}</span>
                            </button>

                            <div className="mt-6 flex items-center justify-center text-gray-400 text-xs space-x-1">
                                <ShieldCheck size={14} />
                                <span>Secure SSL Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
