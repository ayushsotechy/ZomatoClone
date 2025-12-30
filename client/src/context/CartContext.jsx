import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    
    // Safety Flag: Prevents saving before loading is done
    const [isLoaded, setIsLoaded] = useState(false);

    // Calculate the unique key based on user ID
    const userId = user?.id || user?._id;
    const cartKey = userId ? `zomatoCart_${userId}` : 'zomatoCart_guest';

    // 1. LOAD EFFECT (Runs when user changes)
    useEffect(() => {
        setIsLoaded(false); // Stop saving while we switch users
        
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setCartItems([]);
        }

        setIsLoaded(true); // Now allowed to save
    }, [cartKey]);

    // 2. SAVE EFFECT (Runs when items change)
    useEffect(() => {
        // STOP! Don't save if we haven't finished loading yet.
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
            return [...prevItems, { ...food, quantity: 1 }];
        });
    };

    const removeFromCart = (foodId) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== foodId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalPrice = cartItems.reduce((total, item) => total + (item.price || 100) * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);