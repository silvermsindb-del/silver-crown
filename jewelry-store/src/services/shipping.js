import api from '@/lib/api';

export const getShippingMethods = async () => {
    const response = await api.get('/shipping-methods', {
        params: {
            sort: 'price', // Sort by cheapest first
        }
    });
    return response.docs;
};
