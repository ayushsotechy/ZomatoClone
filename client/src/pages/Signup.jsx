// ... imports ...

// ... imports ...

const Signup = () => {
    // ... logic ...

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
            
            {/* ... Background ... */}
            <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/90 to-black/60" />

            {/* --- LAYOUT --- */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* ... Left Side ... */}
                <div className="hidden md:flex flex-col space-y-6">
                     <h1 className="text-6xl font-extrabold text-white tracking-tight">
                        Start Your <br />
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            Journey
                        </span>
                    </h1>
                    {/* ... (Typewriter & Text) ... */}
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

                    {/* ... (Rest of Form - same as Login.jsx but with username field added) ... */}
                    {/* ... Form Logic is identical to previous version, just use the new Tab code above ... */}
                    
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
                        
                        {/* Email & Password inputs... same style as Login */}
                        {/* Submit Button... same style as Login */}
                        
                        {/* ... */}
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
