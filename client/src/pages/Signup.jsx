import React, { useState, useEffect } from 'react';
import { registerUser, registerPartner } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

// --- TYPEWRITER COMPONENT ---
const Typewriter = () => {
    const words = [
        "Join the food revolution.",
        "Partner with us and grow.",
        "Exclusive deals await you.",
        "Your culinary journey starts here."
    ];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        const typeSpeed = isDeleting ? 50 : 100;
        const word = words[currentWordIndex];

        const handleTyping = () => {
            if (!isDeleting) {
                setCurrentText(word.substring(0, currentText.length + 1));
                if (currentText.length === word.length) setTimeout(() => setIsDeleting(true), 2000);
            } else {
                setCurrentText(word.substring(0, currentText.length - 1));
                if (currentText.length === 0) {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        };
        const timer = setTimeout(handleTyping, typeSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex]);

    return (
        <span className="text-gray-300 font-mono border-r-2 border-red-500 pr-1 animate-pulse">
            {currentText}
        </span>
    );
};

const Signup = () => {
    // ✅ MISSING VARIABLES RESTORED HERE
    const [isPartner, setIsPartner] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
            
            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/90 to-black/60" />

            {/* --- LAYOUT --- */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* --- LEFT SIDE: TEXT --- */}
                <div className="hidden md:flex flex-col space-y-6">
                     <h1 className="text-6xl font-extrabold text-white tracking-tight">
                        Start Your <br />
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            Journey
                        </span>
                    </h1>
                    <div className="text-2xl h-10">
                        <Typewriter />
                    </div>
                    <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                        Create an account to track your orders, save your favorite restaurants, and get personalized recommendations.
                    </p>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 ml-auto">
                    
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {isPartner ? "Become a Partner" : "Create Account"}
                        </h2>
                        <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest">
                            {isPartner ? "Expand Your Reach" : "Join the Community"}
                        </p>
                    </div>

                    {/* ✅ SMOOTH SLIDING TABS */}
                    <div className="relative flex w-full bg-black/40 p-1 rounded-xl border border-white/10 mb-6 md:mb-8">
                        
                        {/* 1. The Sliding Background Pill */}
                        <div 
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-in-out shadow-lg ${
                                isPartner 
                                ? "left-[calc(50%+2px)] bg-red-600/20 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                                : "left-1 bg-blue-600/20 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            }`}
                        ></div>

                        {/* 2. User Button (Text Only) */}
                        <button 
                            className={`relative z-10 w-1/2 py-2 md:py-2.5 text-xs md:text-sm font-bold transition-colors duration-300 ${!isPartner ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setIsPartner(false)}
                        >
                            User
                        </button>

                        {/* 3. Partner Button (Text Only) */}
                        <button 
                            className={`relative z-10 w-1/2 py-2 md:py-2.5 text-xs md:text-sm font-bold transition-colors duration-300 ${isPartner ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                            onClick={() => setIsPartner(true)}
                        >
                            Partner
                        </button>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-xl mb-6 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                         {/* Username */}
                         <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                {isPartner ? "RESTAURANT NAME" : "USERNAME"}
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                placeholder={isPartner ? "Tasty Bites" : "FoodieMaster99"}
                                onChange={handleChange} 
                                className={`w-full bg-[#111] border border-gray-800 text-white px-4 py-3 md:py-3.5 rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-gray-600 text-sm ${
                                    isPartner ? "focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                                required 
                            />
                        </div>
                        
                        {/* Email Field */}
                        <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">EMAIL</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="you@example.com" 
                                onChange={handleChange} 
                                className={`w-full bg-[#111] border border-gray-800 text-white px-4 py-3 md:py-3.5 rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-gray-600 text-sm ${
                                    isPartner ? "focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                                required 
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">PASSWORD</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                onChange={handleChange} 
                                className={`w-full bg-[#111] border border-gray-800 text-white px-4 py-3 md:py-3.5 rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-gray-600 text-sm ${
                                    isPartner ? "focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                                required 
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full bg-gray-900 font-bold py-3 md:py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-transform duration-200 mt-2 text-white ${
                                isPartner 
                                ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-900/20"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-900/20"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
                                    Creating...
                                </span>
                            ) : (isPartner ? 'Register Restaurant' : 'Create Account')}
                        </button>
                    </form>

                    <p className="mt-6 md:mt-8 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;