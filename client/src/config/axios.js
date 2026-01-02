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
axiosInstance.interceptors.request.use((config) => {
    // 1. READ THE TOKEN YOU SAVED IN APP.JSX
    const token = localStorage.getItem("zomatoToken"); 
    
    // 2. ATTACH IT TO THE HEADER
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default axiosInstance;