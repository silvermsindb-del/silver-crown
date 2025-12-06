import api from '@/lib/api';

export const getBanners = async () => {
    const response = await api.get('/banners', {
        params: {
            'where[active][equals]': true,
            sort: 'order'
        }
    });
    return response.docs;
};

export const getTestimonials = async () => {
    const response = await api.get('/testimonials');
    return response.docs;
};

export const createTestimonial = async (data) => {
    const response = await api.post('/testimonials', data);
    return response.doc;
};
