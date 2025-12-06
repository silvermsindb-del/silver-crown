import api from '@/lib/api';

export const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name); // Send filename as default alt text

    // Payload usually expects 'media' collection uploads at /media
    const response = await api.post('/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.doc;
};
