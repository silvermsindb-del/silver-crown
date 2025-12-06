import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-9xl font-serif font-bold text-gray-200">404</h1>
            <h2 className="text-3xl font-bold mt-4 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="bg-primary text-white px-8 py-3 uppercase tracking-widest hover:bg-secondary transition-colors">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
