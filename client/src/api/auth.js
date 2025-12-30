import { axiosInstance } from '../config/axios';

// --- USER APIs ---
export const registerUser = async (data) => {
    return await axiosInstance.post('/auth/user/register', data);
};

export const loginUser = async (data) => {
    return await axiosInstance.post('/auth/user/login', data);
};

export const logoutUser = async () => {
    return await axiosInstance.get('/auth/user/logout'); // This was missing!
};

// --- PARTNER APIs ---
export const registerPartner = async (data) => {
    return await axiosInstance.post('/auth/food-partner/register', data);
};

export const loginPartner = async (data) => {
    return await axiosInstance.post('/auth/food-partner/login', data);
};

export const logoutPartner = async () => {
    return await axiosInstance.get('/auth/food-partner/logout'); // This was missing!
};