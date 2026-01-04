import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RedirectHandler = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if a user is logged in AND is a Partner
        if (user && user.role === 'partner') {
            // List of pages a Partner shouldn't be on (like the User Feed)
            const restrictedForPartners = ['/', '/login', '/signup', '/cart'];
            
            // If they are on one of these pages, force redirect to Dashboard
            if (restrictedForPartners.includes(location.pathname)) {
                navigate('/dashboard');
            }
        }
    }, [user, navigate, location]);

    return null; // This component doesn't render anything visible
};

export default RedirectHandler;