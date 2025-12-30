import axios from 'axios';

export const axiosInstance = axios.create({
    // PRODUCTION: Uses relative path '/api' (Nginx handles the rest)
    // DEVELOPMENT: Uses your hardcoded local backend URL
    baseURL: import.meta.env.MODE === 'production' 
        ? '/api' 
        : 'http://localhost:4444/api',
    withCredentials: true
});