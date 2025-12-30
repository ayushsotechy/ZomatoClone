import axios from 'axios';

export const instance = axios.create({
    // If the app is built for production, use the current domain (empty string).
    // If running locally, use your hardcoded port 4444.
    baseURL: import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000',
    withCredentials: true // Ensure this is kept if you use cookies
});