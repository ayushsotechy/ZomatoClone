import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444';

export const axiosInstance = axios.create({
    baseURL: API_URL,
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
