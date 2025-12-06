import React from 'react';
import Image from '@/components/common/Image';

const About = () => {
    return (
        <div className="bg-white min-h-screen pt-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center text-white text-center px-4">
                <div className="absolute inset-0 opacity-40">
                    <img src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=2070&auto=format&fit=crop" alt="Jewelry Crafting" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Story</h1>
                    <p className="text-lg text-gray-200 leading-relaxed font-light">
                        Where tradition meets modern artistry. Discover the essence of Silver Crown Creation.
                    </p>
                </div>
            </div>

            {/* Mission Content */}
            <div className="layout-container py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Crafting Excellence Since 2010</h2>
                        <div className="w-20 h-1 bg-secondary"></div>
                        <p className="text-gray-600 leading-looose font-light text-justify">
                            At Silver Crown Creation, we believe that jewelry is more than just an accessory; it is an expression of individuality and a celebration of life's precious moments.
                            Founded with a passion for exquisite craftsmanship, our journey began with a simple promise: to create timeless pieces that blend heritage with contemporary design.
                        </p>
                        <p className="text-gray-600 leading-loose font-light text-justify">
                            Our artisans meticulously handcraft each piece, ensuring that every curve, setting, and polish meets our exacting standards. We source only the finest ethically mined gemstones and metals, reflecting our commitment to quality and sustainability.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] bg-gray-100 mt-8 rounded overflow-hidden">
                            <Image src="https://images.unsplash.com/photo-1573408301185-a1d31e857414?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Detail" />
                        </div>
                        <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden">
                            <Image src="https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Earrings" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-stone-50 py-24">
                <div className="layout-container text-center">
                    <h2 className="text-3xl font-serif font-bold mb-16">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-10 shadow-sm border-t-4 border-primary hover:translate-y-[-5px] transition-transform duration-300">
                            <h3 className="font-serif font-bold text-xl mb-4">Quality First</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We never compromise on materials or craftsmanship. Each piece is rigorously inspected to ensure perfection.
                            </p>
                        </div>
                        <div className="bg-white p-10 shadow-sm border-t-4 border-secondary hover:translate-y-[-5px] transition-transform duration-300">
                            <h3 className="font-serif font-bold text-xl mb-4">Ethical Sourcing</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We are committed to responsible sourcing, ensuring that our gems and metals are conflict-free and sustainable.
                            </p>
                        </div>
                        <div className="bg-white p-10 shadow-sm border-t-4 border-primary hover:translate-y-[-5px] transition-transform duration-300">
                            <h3 className="font-serif font-bold text-xl mb-4">Customer Centric</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Your happiness is our reward. We strive to provide an exceptional shopping experience, from browsing to unboxing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
