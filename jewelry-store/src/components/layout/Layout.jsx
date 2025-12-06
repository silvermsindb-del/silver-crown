import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-grow pt-0 pb-12">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
