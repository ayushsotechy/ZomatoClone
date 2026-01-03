import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const userId = user?.id || user?._id;
    const cartKey = userId ? `zomatoCart_${userId}` : 'zomatoCart_guest';

    useEffect(() => {
        setIsLoaded(false);
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setCartItems([]);
        }
        setIsLoaded(true);
    }, [cartKey]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, cartKey, isLoaded]);

    const addToCart = (food) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item._id === food._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // ✅ FIX: Ensure price exists, default to 150 if missing
            return [...prevItems, { ...food, price: food.price || 150, quantity: 1 }];
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== foodId));
    };

    // ✅ NEW FUNCTION: Add this to fix the + / - buttons
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item => 
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Use safe math here too
    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 150) * item.quantity, 0);

    return (
        // ✅ Export updateQuantity here
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);