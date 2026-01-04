import axios from 'axios';

export const axiosInstance = axios.create({
    // PRODUCTION: Uses relative path '/api' (Nginx handles the rest)
    // DEVELOPMENT: Uses your hardcoded local backend URL
    baseURL: import.meta.env.MODE === 'production' 
        ? ''
        : 'http://localhost:4444',
    withCredentials: true
});
// Add the Interceptor (This attaches the token to every request)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("zomatoToken"); // Make sure this matches App.jsx
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosInstance;