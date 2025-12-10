import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'https://silver-crown-backend.onrender.com';
    url = url.replace(/\/$/, ''); // Remove trailing slash
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response.data, // Return data directly usually convenient
    (error) => {
        // Handle global errors like 401, 403, 500
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
