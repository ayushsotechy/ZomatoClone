import React, { useState } from 'react';
import { registerUser, registerPartner } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [isPartner, setIsPartner] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isPartner) {
                await registerPartner(formData);
                alert("Partner Registration Successful!");
                navigate('/login');
            } else {
                await registerUser(formData);
                alert("User Registration Successful!");
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
                
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
                        type="text" 
                        name="username" 
                        placeholder={isPartner ? "Restaurant Name" : "Full Name"}
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        required 
                    />
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
                        {isPartner ? 'Register Restaurant' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-red-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;