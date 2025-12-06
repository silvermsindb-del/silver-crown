import React, { useState } from 'react';
import { useGlobalData } from '../hooks/useGlobalData';
import EnquiryForm from './EnquiryForm';

const Navbar = () => {
    const { data, loading } = useGlobalData();
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    if (loading) return <nav className="p-4">Loading...</nav>;

    const { header } = data || {};
    const { logo, menuItems } = header || {};

    return (
        <>
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    {logo && (
                        <img
                            src={logo.url}
                            alt={logo.alt}
                            className="h-10 w-auto mr-4"
                        />
                    )}
                    <span className="font-bold text-xl">My Jewelry Store</span>
                </div>

                {/* Menu Items */}
                <div className="hidden md:flex space-x-6">
                    {menuItems?.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div>
                    <button
                        onClick={() => setIsEnquiryOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Enquiry
                    </button>
                </div>
            </nav>

            {/* Enquiry Modal */}
            {isEnquiryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setIsEnquiryOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                        <div className="p-2">
                            <EnquiryForm />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
