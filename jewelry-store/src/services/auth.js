import api from '@/lib/api';

export const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response;
};

export const registerUser = async (data) => {
    // Assuming 'users' collection is open for create, or there is another registration endpoint
    const response = await api.post('/users', data);
    return response;
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response;
};

export const logoutUser = async () => {
    const response = await api.post('/users/logout');
    return response;
};
