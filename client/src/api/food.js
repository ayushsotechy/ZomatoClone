import { axiosInstance } from '../config/axios';

// Create new Food Item (with Video)
export const createFood = async (formData) => {
    // Note: We don't manually set Content-Type here; 
    // Axios allows the browser to set it to 'multipart/form-data' automatically
    // which is required for file uploads to work correctly.
    const response = await axiosInstance.post('/food/create', formData);
    return response.data;
};
// --- ADD THIS NEW FUNCTION ---
export const toggleLike = async (foodId) => {
    // 1. Get the currently logged-in user
    const userString = localStorage.getItem('zomatoUser');
    if (!userString) return; // If not logged in, stop

    const user = JSON.parse(userString);
    
    // IMPORTANT: Check both .id and ._id because different logins might save it differently
    const userId = user.id || user._id;

    // 2. Send the userId in the body
    const response = await axiosInstance.post(`/food/like/${foodId}`, { userId });
    return response.data;
};

// Get All Foods (For the feed later)
export const getAllFoods = async () => {
    const response = await axiosInstance.get('/food/all');
    return response.data;
};
// ... existing imports and functions ...

export const addComment = async (foodId, text) => {
    const userString = localStorage.getItem('zomatoUser');
    if (!userString) return; 

    const user = JSON.parse(userString);
    const userId = user.id || user._id;

    const response = await axiosInstance.post(`/food/comment/${foodId}`, { 
        userId, 
        text 
    });
    return response.data;
    
};
export const getPartnerFoods = async (partnerId) => {
    const response = await axiosInstance.get(`/food/partner/${partnerId}`);
    return response.data;
};