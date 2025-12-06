import api from '@/lib/api';

export const createEnquiry = async (data) => {
    const response = await api.post('/enquiries', data);
    return response;
};
