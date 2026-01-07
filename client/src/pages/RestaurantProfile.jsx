import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../config/axios';
import { useAuth } from '../context/AuthContext';
import ReelModal from '../components/ReelModal';

const RestaurantProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedReel, setSelectedReel] = useState(null);

    const fetchRestaurantData = useCallback(async () => {
        try {
            const userRes = await axiosInstance.get(`/auth/get-user/${id}`);
            setRestaurant(userRes.data);

            const reelsRes = await axiosInstance.get(`/food/user/${id}`);
            let reelsData = [];
            if (Array.isArray(reelsRes.data)) reelsData = reelsRes.data;
            else if (reelsRes.data.data) reelsData = reelsRes.data.data;
            else if (reelsRes.data.foods) reelsData = reelsRes.data.foods;

            setReels(reelsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching details:", error);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRestaurantData();
    }, [id, fetchRestaurantData]);

    const handleFollow = () => setIsFollowing(!isFollowing);

    // --- LOADING ---
    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
    );

    // --- NOT FOUND ---
    if (!restaurant) return (
        <div className="h-screen w-full flex items-center justify-center bg-black text-zinc-500">
            User not found.
        </div>
    );

    // --- LAYOUT ---
    return (
        // ✅ SCROLL FIX: Changed 'min-h-screen' to 'h-screen overflow-y-auto'
        // This forces this specific page to handle its own scrolling independent of the main app
        <div className="h-screen overflow-y-auto bg-black text-white w-full relative custom-scrollbar">
            
            {/* MODAL */}
            {selectedReel && (
                <ReelModal 
                    video={selectedReel} 
                    onClose={() => setSelectedReel(null)} 
                    refreshData={fetchRestaurantData} 
                />
            )}

            {/* 1. HERO BANNER */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10"></div>
                {restaurant.profilePic ? (
                    <img 
                        src={restaurant.profilePic} 
                        alt="cover" 
                        className="w-full h-full object-cover blur-sm opacity-60 scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900"></div>
                )}
            </div>

            {/* 2. CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20 -mt-20 md:-mt-32 pb-20">
                
                {/* --- PROFILE CARD --- */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-10">
                    
                    {/* Avatar (Floating with Neon Band) */}
                    <div className="relative shrink-0 group">
                        {/* Neon Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Profile Picture Container */}
                        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-2 border-orange-500/50 p-1 bg-black overflow-hidden shadow-2xl z-10">
                            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                {restaurant.profilePic ? (
                                    <img src={restaurant.profilePic} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-zinc-600">
                                        {restaurant.username?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="flex-1 w-full md:w-auto flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            
                            {/* Names */}
                            <div className="mb-2 md:mb-0">
                                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                                    {restaurant.name || restaurant.username}
                                </h1>
                                <p className="text-zinc-300 font-medium drop-shadow-md">@{restaurant.username}</p>
                            </div>

                            {/* Action Buttons */}
                            {user?._id !== restaurant._id && (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleFollow}
                                        className={`px-8 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg ${
                                            isFollowing 
                                            ? 'bg-zinc-800 text-white border border-zinc-700' 
                                            : 'bg-white text-black hover:bg-zinc-200'
                                        }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button className="px-6 py-2.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-white font-bold text-sm hover:bg-zinc-800 active:scale-95 shadow-lg">
                                        Message
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bio & Link */}
                        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-4 md:max-w-2xl shadow-xl">
                            <p className="text-zinc-200 whitespace-pre-line leading-relaxed text-sm md:text-base">
                                {restaurant.bio || "🍳 Creating culinary magic.\n✨ Serving fresh flavors daily.\n👇 Tap the link below to order."}
                            </p>
                            {restaurant.website && (
                                <a href={restaurant.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-sm mt-3 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    {restaurant.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- STATS BAR --- */}
                <div className="flex items-center gap-8 border-y border-zinc-800 py-6 mb-10">
                     <div className="text-center md:text-left">
                        <span className="block text-2xl font-bold text-white">{reels?.length || 0}</span>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Posts</span>
                     </div>
                     <div className="w-px h-10 bg-zinc-800"></div>
                     <div className="text-center md:text-left">
                        <span className="block text-2xl font-bold text-white">{restaurant.followers?.length || 0}</span>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Followers</span>
                     </div>
                     <div className="w-px h-10 bg-zinc-800"></div>
                     <div className="text-center md:text-left">
                        <span className="block text-2xl font-bold text-white">{restaurant.following?.length || 0}</span>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Following</span>
                     </div>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-orange-500">❖</span> Latest Reels
                    </h3>

                    {!Array.isArray(reels) || reels.length === 0 ? (
                        <div className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center py-24 text-zinc-500">
                            <div className="bg-zinc-800 p-4 rounded-full mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <p>No reels shared yet.</p>
                        </div>
                    ) : (
                       <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
    {reels.map((reel) => (
        <div 
            key={reel._id} 
            onClick={() => setSelectedReel(reel)} 
            className="group relative aspect-[3/4] bg-zinc-900 cursor-pointer overflow-hidden rounded-sm"
        >
            <video 
                src={reel.video} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                muted
                loop
                onMouseEnter={e => e.target.play()}
                onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
            />
            
            {/* --- AESTHETIC OVERLAY --- */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <div className="flex items-center gap-4 text-white">
                    
                    {/* Like Icon (Heart) */}
                    <div className="flex items-center gap-1.5">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5 text-white drop-shadow-md"
                        >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                        <span className="font-bold text-sm drop-shadow-md tracking-wide">
                            {reel.likes?.length || 0}
                        </span>
                    </div>

                    {/* Comment Icon (Bubble) */}
                    <div className="flex items-center gap-1.5">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5 text-white drop-shadow-md"
                        >
                            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-sm drop-shadow-md tracking-wide">
                            {reel.comments?.length || 0}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    ))}
</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;