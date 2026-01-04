import { axiosInstance } from '../config/axios';

export const createPaymentOrder = async (amount) => {
    // This matches: app.use("/payment", ...) in your backend
    // So the full URL is: http://localhost:4444/payment/create-order
    const response = await axiosInstance.post('/payment/create-order', { amount });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    // paymentData = { razorpay_payment_id, cartItems, totalAmount }
    const response = await axiosInstance.post('/payment/verify', paymentData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosInstance.get('/payment/orders');
    return response.data;
};