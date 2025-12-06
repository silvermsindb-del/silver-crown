import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/services/orders';
import { formatCurrency } from '@/lib/utils';
import { Package, Truck, MapPin, Calendar, CreditCard, ChevronLeft, Printer } from 'lucide-react';
import Image from '@/components/common/Image';
import clsx from 'clsx';

const OrderDetails = () => {
    const { id } = useParams();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrderById(id)
    });

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="min-h-screen pt-32 flex justify-center"><div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" /></div>;

    if (error || !order) return (
        <div className="min-h-screen pt-32 text-center">
            <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
            <Link to="/profile" className="text-primary hover:underline">Back to Orders</Link>
        </div>
    );

    const steps = [
        { status: 'pending', label: 'Order Placed' },
        { status: 'processing', label: 'Processing' },
        { status: 'shipped', label: 'Shipped' },
        { status: 'delivered', label: 'Delivered' }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) || 0;

    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24 print:pt-0 print:bg-white">
            <div className="layout-container max-w-4xl print:max-w-none print:px-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Link to="/profile" className="inline-flex items-center text-gray-500 hover:text-stone-900 transition-colors font-medium text-sm">
                        <ChevronLeft size={16} className="mr-1" />
                        Back to Orders
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-colors"
                    >
                        <Printer size={16} />
                        <span>Print Invoice</span>
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-sm overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
                    <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 print:flex-row print:border-b-2 print:border-gray-800">
                        <div>
                            {/* Print Only Header */}
                            <div className="hidden print:block mb-4">
                                <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wider">LUXE.</h1>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Premium Jewelry</p>
                            </div>

                            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Order #{order.id.slice(-6)}</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Calendar size={14} className="print:hidden" />
                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider print:border print:border-gray-300 print:text-gray-900",
                                order.status === 'delivered' ? "bg-green-100 text-green-700" :
                                    order.status === 'shipped' ? "bg-blue-100 text-blue-700" :
                                        ['return_requested', 'replacement_requested'].includes(order.status) ? "bg-orange-100 text-orange-700" :
                                            "bg-yellow-100 text-yellow-700"
                            )}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Tracker (Simplified) - Hide in print */}
                    {!['return_requested', 'replacement_requested', 'cancelled'].includes(order.status) && (
                        <div className="p-6 md:p-8 bg-stone-50 border-b border-gray-100 print:hidden">
                            <div className="flex justify-between relative">
                                {/* Prop */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2" />
                                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 -translate-y-1/2 transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />

                                {steps.map((step, idx) => {
                                    const completed = idx <= currentStepIndex;
                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors",
                                                completed ? "border-green-500 text-green-500" : "border-gray-300 text-gray-300"
                                            )}>
                                                {completed ? <div className="w-3 h-3 bg-green-500 rounded-full" /> : <div className="w-2 h-2 bg-gray-200 rounded-full" />}
                                            </div>
                                            <span className={clsx(
                                                "text-[10px] md:text-xs font-bold uppercase mt-2 tracking-wide",
                                                completed ? "text-stone-900" : "text-gray-400"
                                            )}>{step.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 print:border-b print:border-gray-200">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2 print:text-gray-900 print:mb-2">
                                <Truck size={14} className="print:hidden" /> Shipping Information
                            </h3>
                            <div className="text-sm text-gray-700 space-y-1 border-l-2 border-transparent pl-0 print:border-l-0">
                                <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                                <p>{order.shippingAddress?.addressLine1}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>
                                <p className="mt-2 text-gray-500">{order.shippingAddress?.phone}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 print:hidden">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Method</h3>
                                <p className="text-sm font-medium">{order.shippingMethod || 'Standard'} Shipping</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2 print:text-gray-900 print:mb-2">
                                <CreditCard size={14} className="print:hidden" /> Payment Details
                            </h3>
                            <div className="text-sm text-gray-700">
                                <p className="capitalize font-medium">Method: {order.paymentMethod?.replace('_', ' ')}</p>
                                <p className="text-gray-500 mt-1">Status: {order.status === 'pending' ? 'Pending' : 'Paid'}</p>
                                <div className="hidden print:block mt-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Sold By</h3>
                                    <p>LUXE Jewelry Inc.</p>
                                    <p>123 Fashion Ave, NY</p>
                                    <p>support@luxe.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-sm overflow-hidden print:shadow-none print:border print:border-gray-200">
                    <div className="p-6 md:p-8 border-b border-gray-100 print:bg-gray-50">
                        <h2 className="text-lg font-bold font-serif">Order Items</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {order.items?.map((item, idx) => {
                            const product = typeof item.product === 'object' ? item.product : null;
                            const productName = product ? (product.name || product.title) : 'Product';
                            const productImg = product?.images?.[0]?.cloudinary?.secure_url || product?.images?.[0]?.url;

                            return (
                                <div key={idx} className="p-6 flex gap-4 md:gap-6 items-center print:py-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200 print:hidden">
                                        {productImg && <Image src={productImg} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 mb-1">{productName}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-medium">
                                        {formatCurrency(item.price)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                        <div className="max-w-xs ml-auto space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.total - (order.shippingCost || 0))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{(order.shippingCost === 0 || !order.shippingCost) ? 'Free' : formatCurrency(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
