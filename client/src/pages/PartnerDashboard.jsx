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
            // Create a temporary URL to preview the video instantly
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile || !name || !desc) {
            setMessage("Please fill all fields and select a video.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // 1. Create FormData (Required for file uploads)
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc); // Controller expects 'desc'
            formData.append('video', videoFile); // Controller expects 'video'

            // 2. Send to Backend
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.username}</p>
                    </div>
                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
                        Partner Account
                    </span>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left: Form */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Upload New Reel 🎥</h2>
                        
                        {message && (
                            <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    placeholder="e.g. Butter Chicken Special"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none h-24"
                                    placeholder="Describe the taste, ingredients..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video Reel</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-gray-500">
                                        {videoFile ? (
                                            <span className="text-green-600 font-medium">{videoFile.name}</span>
                                        ) : (
                                            <>
                                                <p className="text-2xl mb-1">📹</p>
                                                <p className="text-sm">Click to select video</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                {loading ? 'Uploading Reel...' : 'Publish Food Reel'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Mobile Preview */}
                    <div className="flex flex-col items-center justify-center bg-gray-900 rounded-2xl p-4 text-white min-h-[500px]">
                        {previewUrl ? (
                            <div className="relative w-full h-full max-w-[250px] aspect-[9/16] bg-black rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                                {/* Simulating Mobile Reel View */}
                                <video 
                                    src={previewUrl} 
                                    className="w-full h-full object-cover"
                                    autoPlay 
                                    muted 
                                    loop 
                                />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-bold text-lg drop-shadow-md">{name || "Dish Name"}</h3>
                                    <p className="text-sm opacity-90 truncate drop-shadow-md">{desc || "Description..."}</p>
                                    <button className="mt-2 w-full bg-red-600 text-white text-xs font-bold py-2 rounded shadow-lg">
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-50">
                                <p className="text-4xl mb-4">📱</p>
                                <p>Reel Preview</p>
                                <p className="text-xs mt-2">Upload a video to see how it looks</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;