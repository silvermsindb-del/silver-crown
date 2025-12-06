import api from '@/lib/api';

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.doc;
};

export const getMyOrders = async () => {
    const response = await api.get('/orders', {
        params: {
            sort: '-createdAt',
            depth: 2
        }
    });
    return response.docs;
};

export const updateOrder = async (id, data) => {
    const response = await api.patch(`/orders/${id}`, data);
    return response.doc;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response; // GET by ID returns the document directly, not wrapped in 'doc'
};
