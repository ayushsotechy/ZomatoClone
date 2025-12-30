import axios from 'axios';

const BASE_URL = 'http://localhost:4444/api'; 

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    // REMOVED: headers: { 'Content-Type': 'application/json' } 
    // Allowing Axios to set this automatically solves the issue!
});