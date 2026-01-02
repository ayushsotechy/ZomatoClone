import React, { useState } from 'react';
import { loginUser, loginPartner } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import hook

const Login = () => {
    const [isPartner, setIsPartner] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth(); // 2. Get login function from context

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isPartner) {
                const response = await loginPartner(formData);
                // 3. Save user with "partner" role
                login({ ...response.data.user, role: 'partner' }); 
                alert("Partner Login Successful!");
                navigate('/dashboard'); 
            } else {
                const response = await loginUser(formData);
                 // 3. Save user with "user" role
                login({ ...response.data.user, role: 'user' });
                alert("User Login Successful!");
                navigate('/'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };
    const handleGoogleLogin = () => {
    // 1. Determine the correct backend URL
    // If we are on localhost, go directly to port 4444
    // If we are live, use the relative path '/auth/google' (which Nginx will handle later)
    const googleAuthUrl = window.location.hostname === 'localhost' 
      ? "http://localhost:4444/auth/google"
      : "/auth/google";

    // 2. Redirect the browser to Google
    window.location.href = googleAuthUrl; 
  };

    // ... return (JSX remains the same) ...
    return (
        // ... (Keep your existing UI code) ...
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           {/* Paste your previous UI code here if you deleted it, or just update the logic above */}
           {/* Let me know if you need the full UI code again! */}
             <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
                
                {/* Tabs */}
                <div className="flex mb-6 border-b border-gray-200">
                    <button 
                        className={`w-1/2 pb-2 text-sm font-medium ${!isPartner ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        onClick={() => setIsPartner(false)}
                    >
                        User
                    </button>
                    <button 
                        className={`w-1/2 pb-2 text-sm font-medium ${isPartner ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        onClick={() => setIsPartner(true)}
                    >
                        Partner
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        required 
                    />
                    <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors">
                        {isPartner ? 'Login as Partner' : 'Login as User'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    New here? <Link to="/signup" className="text-red-500 hover:underline">Create an account</Link>
                </p>
                            <div className="mt-4">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg"
        >
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
            </div>

        </div>
    );
};

export default Login;