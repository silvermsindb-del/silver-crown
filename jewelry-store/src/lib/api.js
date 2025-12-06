import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
});

export default api;
