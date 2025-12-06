import React from 'react';
import { Truck, RefreshCw, ShieldCheck } from 'lucide-react';

const Shipping = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="layout-container max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shipping & Returns</h1>
                    <p className="text-gray-500">Everything you need to know about delivery and our policies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-gray-100 pb-16">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gray-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                        <p className="text-sm text-gray-500">On all domestic orders over ₹5,000</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gray-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <RefreshCw size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">30-Day Returns</h3>
                        <p className="text-sm text-gray-500">Hassle-free returns and exchanges</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gray-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Secure Delivery</h3>
                        <p className="text-sm text-gray-500">Insured shipping for peace of mind</p>
                    </div>
                </div>

                <div className="space-y-12 text-gray-700 leading-relaxed">
                    <section>
                        <h3 className="text-xl font-serif font-bold mb-4">Shipping Policy</h3>
                        <p className="mb-4">
                            We strive to ship all orders within 24-48 hours of purchase. Orders placed on weekends or holidays will be processed on the next business day.
                            Once your order has shipped, you will receive a confirmation email with a tracking number.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 bg-gray-50 p-6 rounded">
                            <li><strong>Standard Shipping:</strong> 5-7 business days (Free over ₹5,000)</li>
                            <li><strong>Express Shipping:</strong> 2-3 business days (₹250 flat rate)</li>
                            <li><strong>Overnight Shipping:</strong> 1 business day (Calculated at checkout)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-serif font-bold mb-4">International Shipping</h3>
                        <p>
                            We ship globally! International shipping rates vary based on destination and package weight.
                            Please note that customers are responsible for any customs duties or taxes incurred upon delivery.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-serif font-bold mb-4">Returns & Exchanges</h3>
                        <p className="mb-4">
                            Your satisfaction is our priority. If you are not completely in love with your purchase, you may return it within 30 days of receiving your order.
                        </p>
                        <p className="mb-4">
                            To be eligible for a return, the item must be:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                            <li>Unworn and in original condition</li>
                            <li>In the original packaging with all tags attached</li>
                            <li>Accompanied by the proof of purchase</li>
                        </ul>
                        <p className="mt-4 text-sm bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
                            <strong>Note:</strong> Customized or personalized items are final sale and cannot be returned unless defective.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
