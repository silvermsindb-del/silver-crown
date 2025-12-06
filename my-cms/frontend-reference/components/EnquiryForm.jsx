import React, { useState } from 'react';
import api from '../api';

const EnquiryForm = ({ productName = '' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        productName: productName,
        message: '',
        image: null,
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            // 1. Create FormData for multipart/form-data submission
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (formData.productName) data.append('productName', formData.productName);
            data.append('message', formData.message);

            // Payload expects 'file' field for uploads if using standard upload endpoint, 
            // but for a collection with upload enabled, we might need to upload media first 
            // or send it as part of the create request if supported.
            // Payload v3 standard approach: Upload media first, then link it.
            // However, for simplicity in this reference, we'll assume a custom endpoint or 
            // standard Payload behavior where 'image' field in collection is an upload.

            // BETTER APPROACH for Payload:
            // 1. Upload image to 'media' collection
            // 2. Get ID
            // 3. Create enquiry with image ID

            let imageId = null;
            if (formData.image) {
                const mediaData = new FormData();
                mediaData.append('file', formData.image);
                const uploadRes = await api.post('/media', mediaData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageId = uploadRes.data.doc.id;
            }

            // 2. Create Enquiry
            const enquiryPayload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                productName: formData.productName,
                message: formData.message,
                image: imageId, // Link the uploaded image
            };

            await api.post('/enquiries', enquiryPayload);

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                productName: '',
                message: '',
                image: null,
            });
        } catch (error) {
            console.error('Enquiry submission failed:', error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="p-6 bg-green-50 text-green-700 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p>We will contact you shortly.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-sm underline"
                >
                    Send another enquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Make an Enquiry</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            {productName && (
                <div>
                    <label className="block text-sm font-medium mb-1">Product</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border rounded"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Upload Image (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Max 1 image. Screenshots or references allowed.</p>
            </div>

            {status === 'error' && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {status === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
            </button>
        </form>
    );
};

export default EnquiryForm;
