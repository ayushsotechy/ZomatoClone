import React, { useState } from 'react';
import { createFood } from '../api/food';
import { useAuth } from '../context/AuthContext';

const PartnerDashboard = () => {
    const { user } = useAuth();
    
    // Form State
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile || !name || !desc) {
            setMessage("❌ Please fill all fields and select a video.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('video', videoFile);

            await createFood(formData);
            
            setMessage('✅ Reel uploaded successfully! Your food is live.');
            // Reset form
            setName('');
            setDesc('');
            setVideoFile(null);
            setPreviewUrl(null);

        } catch (error) {
            console.error(error);
            setMessage('❌ Upload failed. ' + (error.response?.data?.message || 'Server Error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-black text-white p-4 md:p-6 overflow-y-auto md:overflow-hidden flex flex-col relative">
            
            {/* --- Background Ambience --- */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full relative z-10 h-full flex flex-col justify-center">
                
                {/* Header (Compact) */}
                <div className="mb-6 flex flex-row justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Restaurant <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-xs mt-1">Welcome back, <span className="text-white font-bold">{user?.username}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[#111] border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                            Partner Account
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start h-auto">
                    
                    {/* Left: Upload Form */}
                    <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl relative">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            Upload New Reel <span className="text-xl">🎥</span>
                        </h2>
                        
                        {message && (
                            <div className={`p-3 rounded-lg mb-4 text-xs font-bold border ${message.includes('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Dish Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Dish Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-700 text-sm font-medium"
                                    placeholder="e.g. Butter Chicken Special"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                                <textarea 
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-700 min-h-[80px] resize-none text-sm font-medium"
                                    placeholder="Describe the taste..."
                                />
                            </div>

                            {/* Video File Input (Compact) */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Upload Video Reel</label>
                                <div className="relative w-full border-2 border-dashed border-gray-800 hover:border-red-500/50 rounded-xl bg-black/50 p-4 text-center transition-all group overflow-hidden cursor-pointer h-24 flex items-center justify-center">
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="relative z-10 flex flex-col items-center">
                                        {videoFile ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                                <span className="text-white font-bold text-xs truncate max-w-[150px]">{videoFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <p className="text-gray-300 font-bold text-xs group-hover:text-red-400 transition-colors">Click to select video</p>
                                                <p className="text-gray-600 text-[10px] mt-0.5">MP4, MOV (Max 50MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-red-900/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm ${
                                    loading 
                                    ? 'bg-gray-800 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
                                }`}
                            >
                                {loading ? 'Uploading...' : 'Publish Food Reel'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Mobile Preview */}
                    <div className="hidden lg:flex flex-col items-center justify-center h-full pt-2">
                        <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Live Preview</h3>
                        
                        {/* Phone Frame (Fixed Height for Laptop Screens) */}
                        <div className="relative w-[280px] h-[520px] bg-black border-[6px] border-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
                            
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-lg z-30"></div>

                            {/* Screen Content */}
                            <div className="w-full h-full bg-[#111] relative group">
                                {previewUrl ? (
                                    <>
                                        <video 
                                            src={previewUrl} 
                                            className="w-full h-full object-cover"
                                            autoPlay 
                                            muted 
                                            loop 
                                        />
                                        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                                        <div className="absolute bottom-0 inset-x-0 p-5 pb-6">
                                            <h3 className="text-white font-bold text-lg drop-shadow-lg mb-0.5 leading-tight line-clamp-1">
                                                {name || "Dish Name"}
                                            </h3>
                                            <p className="text-gray-200 text-[10px] opacity-90 line-clamp-2 drop-shadow-md mb-3">
                                                {desc || "Description of the dish goes here..."}
                                            </p>
                                            <button className="w-full bg-red-600 text-white text-[10px] font-bold py-2.5 rounded-full shadow-lg">
                                                Order Now
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 opacity-50">
                                        <p className="font-bold text-sm">Reel Preview</p>
                                        <p className="text-[10px] mt-1">Upload to view</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;