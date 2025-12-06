import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, updateOrder } from '@/services/orders';
import { uploadMedia } from '@/services/media';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, User, RefreshCw, X, Upload, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import clsx from 'clsx';
import Image from '@/components/common/Image';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Return Modal State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [returnType, setReturnType] = useState('replacement');
    const [returnReason, setReturnReason] = useState('');
    const [returnImages, setReturnImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Redirect if not logged in and not loading
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

    const { data: orders, isLoading: ordersLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
        enabled: !!user
    });

    const updateOrderMutation = useMutation({
        mutationFn: ({ id, data }) => updateOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['my-orders']);
            setReturnModalOpen(false);
            setReturnReason('');
            setReturnImages([]); // Clear images
            setSelectedOrder(null);
        }
    });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const openReturnModal = (order) => {
        setSelectedOrder(order);
        setReturnModalOpen(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setReturnImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index) => {
        setReturnImages(prev => prev.filter((_, i) => i !== index));
    };

    const submitReturn = async () => {
        if (!selectedOrder || !returnReason) return;

        setIsUploading(true);
        try {
            // Upload images first
            let uploadedImageIds = [];
            if (returnImages.length > 0) {
                const uploadPromises = returnImages.map(file => uploadMedia(file));
                const uploadedDocs = await Promise.all(uploadPromises);
                uploadedImageIds = uploadedDocs.map(doc => doc.id);
            }

            const newStatus = returnType === 'refund' ? 'return_requested' : 'replacement_requested';

            updateOrderMutation.mutate({
                id: selectedOrder.id,
                data: {
                    status: newStatus,
                    returnDetails: {
                        type: returnType,
                        reason: returnReason,
                        images: uploadedImageIds,
                        requestDate: new Date().toISOString()
                    }
                }
            });
        } catch (error) {
            console.error("Failed to upload return images", error);
            // Optionally set error state here
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen pt-32 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-20 relative">

            {/* Return/Replacement Modal */}
            <AnimatePresence>
                {returnModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setReturnModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-serif font-bold mb-4">Request Return / Exchange</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Order #{selectedOrder?.id.slice(-6)}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">I want a...</label>
                                    <div className="flex space-x-4">
                                        <label className={`flex-1 border rounded p-3 cursor-pointer transition-colors ${returnType === 'replacement' ? 'border-stone-900 bg-stone-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="replacement"
                                                checked={returnType === 'replacement'}
                                                onChange={(e) => setReturnType(e.target.value)}
                                                className="mr-2 accent-stone-900"
                                            />
                                            <span className="text-sm font-medium">Replacement</span>
                                        </label>
                                        <label className={`flex-1 border rounded p-3 cursor-pointer transition-colors ${returnType === 'refund' ? 'border-stone-900 bg-stone-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="refund"
                                                checked={returnType === 'refund'}
                                                onChange={(e) => setReturnType(e.target.value)}
                                                className="mr-2 accent-stone-900"
                                            />
                                            <span className="text-sm font-medium">Refund</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Reason</label>
                                    <textarea
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-stone-900 h-24 resize-none"
                                        placeholder="Wrong size, damaged, etc..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Upload Images (Optional)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-stone-400 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                        <p className="text-sm text-gray-500">Click to upload images</p>
                                    </div>

                                    {/* Image Previews */}
                                    {returnImages.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2 mt-4">
                                            {returnImages.map((file, idx) => (
                                                <div key={idx} className="relative aspect-square rounded overflow-hidden border border-gray-100 group">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                                                    <button
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={submitReturn}
                                    disabled={!returnReason || updateOrderMutation.isLoading || isUploading}
                                    className="w-full bg-stone-900 text-white py-3 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {(updateOrderMutation.isLoading || isUploading) && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    <span>{updateOrderMutation.isLoading || isUploading ? 'Submitting...' : 'Submit Request'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="layout-container">
                <div className="bg-white md:shadow-sm md:border border-gray-100 rounded-sm overflow-hidden">
                    <div className="md:flex">
                        {/* Sidebar */}
                        <div className="md:w-1/4 bg-stone-50 md:border-r border-gray-100 p-8 text-center md:text-left">
                            <div className="mb-8 flex flex-col items-center md:items-start">
                                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4 text-stone-500">
                                    <User size={32} />
                                </div>
                                <h2 className="font-serif font-bold text-lg">{user.name}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <nav className="space-y-2">
                                <button className="w-full flex items-center justify-center md:justify-start space-x-3 px-4 py-3 bg-white border border-gray-200 text-primary font-bold text-sm tracking-wide rounded shadow-sm">
                                    <Package size={16} />
                                    <span>My Orders</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center md:justify-start space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors rounded"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="md:w-3/4 p-6 md:p-12">
                            <h2 className="text-xl font-serif font-bold mb-6 text-gray-900 border-b pb-4">Order History</h2>

                            {ordersLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded" />)}
                                </div>
                            ) : orders && orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-gray-200 rounded overflow-hidden bg-white">
                                            <div className="bg-gray-50 px-4 py-3 flex flex-wrap justify-between items-center gap-4 text-xs md:text-sm">
                                                <div className="flex gap-4 md:gap-8 text-gray-600">
                                                    <div>
                                                        <span className="block text-[10px] uppercase font-bold text-gray-400">Date</span>
                                                        <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase font-bold text-gray-400">Total</span>
                                                        <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => navigate(`/order/${order.id}`)}
                                                            className="text-stone-900 underline text-xs font-bold uppercase tracking-wider hover:text-stone-600"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={clsx(
                                                        "font-bold uppercase text-[10px] px-2 py-1 rounded-full",
                                                        order.status === 'delivered' ? "bg-green-100 text-green-700" :
                                                            order.status === 'shipped' ? "bg-blue-100 text-blue-700" :
                                                                ['return_requested', 'replacement_requested'].includes(order.status) ? "bg-orange-100 text-orange-700" :
                                                                    "bg-yellow-100 text-yellow-700"
                                                    )}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                    {order.status === 'delivered' && (
                                                        <button
                                                            onClick={() => openReturnModal(order)}
                                                            className="text-stone-500 hover:text-stone-900 text-xs underline font-medium flex items-center space-x-1"
                                                        >
                                                            <RefreshCw size={12} />
                                                            <span>Return / Exchange</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                {order.items?.map((item, index) => {
                                                    const product = typeof item.product === 'object' ? item.product : null;
                                                    const productName = product ? (product.name || product.title) : 'Product';
                                                    const productImg = product?.images?.[0]?.cloudinary?.secure_url || product?.images?.[0]?.url;

                                                    return (
                                                        <div key={index} className="flex items-center space-x-4 py-3 border-b last:border-0 border-gray-100">
                                                            <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                                                {productImg && <Image src={productImg} className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-sm text-gray-900 truncate">{productName}</h4>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                            <div className="font-medium text-sm text-gray-900">
                                                                {formatCurrency(item.price)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 rounded border border-dashed border-gray-200">
                                    <Package size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-sm mb-4">No orders placed yet.</p>
                                    <button onClick={() => navigate('/shop')} className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">Start Shopping</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
