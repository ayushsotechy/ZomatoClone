import React, { useState, useEffect } from 'react';
import { loginUser, loginPartner } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// --- TYPEWRITER COMPONENT ---
const Typewriter = () => {
    const words = [
        "Craving something delicious?",
        "Hungry? We've got you covered.",
        "Your favorite food, delivered fast.",
        "Taste the best of your city."
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

const Login = () => {
    const [isPartner, setIsPartner] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isPartner) {
                const response = await loginPartner(formData);
                const userData = response.data.user; 
                localStorage.setItem("zomatoUser", JSON.stringify(userData));
                login({ ...userData, role: 'partner' }); 
                alert("Partner Login Successful!");
                navigate('/dashboard'); 
            } else {
                const response = await loginUser(formData);
                const userData = response.data.user; 
                localStorage.setItem("zomatoUser", JSON.stringify(userData));
                login({ ...userData, role: 'user' });
                alert("User Login Successful!");
                navigate('/'); 
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const googleAuthUrl = window.location.hostname === 'localhost' 
          ? "http://localhost:4444/auth/google"
          : "/auth/google";
        window.location.href = googleAuthUrl; 
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
            
            {/* --- BACKGROUND --- */}
            <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/90 to-black/60" />

            {/* --- LAYOUT --- */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* --- LEFT SIDE --- */}
                <div className="hidden md:flex flex-col space-y-6">
                    <h1 className="text-6xl font-extrabold text-white tracking-tight">
                        Welcome to <br />
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            FlavorFeed
                        </span>
                    </h1>
                    <div className="text-2xl h-10">
                        <Typewriter />
                    </div>
                    <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                        Join thousands of foodies sharing their culinary adventures. 
                        Order from the best restaurants near you.
                    </p>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 ml-auto">
                    
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {isPartner ? "Partner Portal" : "Welcome Back"}
                        </h2>
                        <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest">
                            {isPartner ? "Manage Your Business" : "Login to Continue"}
                        </p>
                    </div>

                    {/* ✅ SMOOTH SLIDING TABS (Fixed) */}
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

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
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
                        
                        <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
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
                                    Processing...
                                </span>
                            ) : (isPartner ? 'Login to Dashboard' : 'Login Now')}
                        </button>
                    </form>

                    {/* Google Login */}
                    <div className="mt-5 md:mt-6">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-800"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-600 text-[10px] font-bold uppercase">Or continue with</span>
                            <div className="flex-grow border-t border-gray-800"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-black font-bold py-3 md:py-3.5 rounded-xl mt-2 flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="mt-6 md:mt-8 text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-white font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;