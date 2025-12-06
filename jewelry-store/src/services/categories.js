import api from '@/lib/api';

export const getCategories = async () => {
    const response = await api.get('/categories', {
        params: {
            limit: 100, // get all usually
            sort: 'title'
        }
    });
    return response.docs;
};
