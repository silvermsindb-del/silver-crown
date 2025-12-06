import api from '@/lib/api';

export const getProducts = async (params = {}) => {
    const response = await api.get('/products', { params });
    return response;
};

export const getFeaturedProducts = async () => {
    const response = await api.get('/products', {
        params: {
            limit: 4,
            sort: '-createdAt'
        }
    });
    return response.docs;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
};
