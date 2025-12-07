import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'https://silver-crown-backend.onrender.com'}/api`,
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
