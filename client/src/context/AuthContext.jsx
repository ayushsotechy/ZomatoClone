import React, { createContext, useState, useContext, useEffect } from 'react';
import { logoutUser, logoutPartner } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize state from LocalStorage so data persists on refresh
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('zomatoUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 2. Login Function: Updates state and LocalStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('zomatoUser', JSON.stringify(userData));
    };

    // 3. Logout Function: Clears state, LocalStorage, and calls Backend
    const logout = async () => {
        try {
            // Check role to call the correct logout endpoint
            if (user?.role === 'partner') {
                await logoutPartner();
            } else {
                await logoutUser();
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
        
        setUser(null);
        localStorage.removeItem('zomatoUser');
        window.location.href = '/login'; // Force redirect
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use the context easily
export const useAuth = () => useContext(AuthContext);