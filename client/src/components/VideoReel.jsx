import React, { useRef, useState, useEffect } from 'react'; // Added useEffect
import { useCart } from '../context/CartContext'; 
import { toggleLike, addComment } from '../api/food';
import { Link } from 'react-router-dom';
import CommentItem from "./CommentItem";

// 1. CHANGE: Accept 'refreshData' here
const VideoReel = ({ food, refreshData }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const { addToCart } = useCart();
    
    // Social State
    const user = JSON.parse(localStorage.getItem('zomatoUser'));
    const userId = user?.id || user?._id;
    
    const [liked, setLiked] = useState(food.likes?.includes(userId));
    const [likeCount, setLikeCount] = useState(food.likes?.length || 0);
    
    // Comment & Details State
    const [showComments, setShowComments] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    // 2. CHANGE: Sync comments with props so replies show up instantly
    const [comments, setComments] = useState(food.comments || []);

    useEffect(() => {
        setComments(food.comments || []);
    }, [food.comments]);
    // ---------------------------------------------------------

    const [commentText, setCommentText] = useState('');

    // --- MOCK DATA ---
    const calories = Math.floor(Math.random() * (600 - 250) + 250); 
    const deliveryTime = Math.floor(Math.random() * (45 - 20) + 20); 

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) videoRef.current.muted = !isMuted;
    };

    const handleLike = async () => {
        const isCurrentlyLiked = liked;
        setLiked(!isCurrentlyLiked);
        setLikeCount(isCurrentlyLiked ? likeCount - 1 : likeCount + 1);
        try {
            await toggleLike(food._id);
        } catch (error) {
            setLiked(isCurrentlyLiked);
            setLikeCount(isCurrentlyLiked ? likeCount : likeCount);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await addComment(food._id, commentText);
            setCommentText('');
            // 3. CHANGE: Refresh data to get the real comment from server
            if (refreshData) refreshData(); 
        } catch (error) {
            console.error("Comment failed");
        }
    };

    const handleOrder = () => {
        addToCart(food); 
        alert(`🍔 Added ${food.name} to your cart!`); 
    };

    return (
        <div className="w-full flex items-center justify-center snap-start relative h-full md:h-screen">
            <div className="relative overflow-hidden bg-gray-900 border-white/5 shadow-2xl shadow-black group w-full h-full md:h-[85vh] md:w-auto md:aspect-[9/16] md:rounded-[35px] md:border">
                
                <video
                    ref={videoRef}
                    src={food.video}
                    className="w-full h-full object-cover"
                    loop
                    autoPlay
                    muted={isMuted}
                    playsInline
                    onClick={toggleMute}
                />

                {/* ... (Keep Mute, Like, Share buttons exactly as they were) ... */}
                <button 
                    onClick={toggleMute}
                    className="absolute top-5 right-5 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm z-10 hover:bg-black/70 transition"
                >
                    {isMuted ? "🔇" : "🔊"}
                </button>

                {/* RIGHT ACTIONS */}
                <div className="absolute bottom-32 right-3 flex flex-col gap-5 items-center z-20">
                    <button onClick={handleLike} className="flex flex-col items-center group">
                        <div className={`p-2 transition-transform transform active:scale-75 ${liked ? 'text-red-500' : 'text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 drop-shadow-lg filter shadow-black">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md shadow-black">{likeCount}</span>
                    </button>

                    <button onClick={() => setShowComments(true)} className="flex flex-col items-center group">
                        <div className="p-2 text-white transition-transform transform active:scale-75">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 drop-shadow-lg filter shadow-black">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md shadow-black">{comments.length}</span>
                    </button>

                    <button onClick={() => setShowDetails(true)} className="flex flex-col items-center group">
                        <div className="p-2 text-white transition-transform transform active:scale-75">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 drop-shadow-lg filter shadow-black">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md shadow-black">Info</span>
                    </button>
                </div>

                {/* BOTTOM OVERLAY */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent text-white z-10 flex flex-col gap-3">
                    <div className="pr-12">
                        <Link to={`/restaurant/${food.foodPartner?._id}`} className="flex items-center gap-2 mb-2 group w-fit">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-[10px] font-bold border border-white/50">
                                {food.foodPartner?.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-bold text-xs text-white drop-shadow-md group-hover:text-red-400 transition-colors">
                                @{food.foodPartner?.username || "Restaurant"}
                            </span>
                        </Link>
                        
                        <h2 className="text-lg font-bold mb-1 drop-shadow-md leading-tight text-white">{food.name}</h2>
                        <p className="text-xs text-gray-200 line-clamp-2 drop-shadow-sm opacity-90">{food.description}</p>
                    </div>

                    <button onClick={handleOrder} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg transform active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2">
                        <span>Order Now</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">₹{food.price || 150}</span>
                    </button>
                </div>
                
                {/* --- POPUPS --- */}
                {showDetails && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-6 animate-in fade-in duration-200">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl w-full h-auto shadow-2xl relative">
                             <button onClick={() => setShowDetails(false)} className="absolute top-3 right-4 text-gray-400 hover:text-white">✕</button>
                             <h3 className="text-lg font-bold text-white mb-4">{food.name}</h3>
                             <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-800 p-2 rounded-xl text-center"><span className="block text-xl">🔥</span><span className="text-xs font-bold text-white">{calories} Kcal</span></div>
                                <div className="bg-gray-800 p-2 rounded-xl text-center"><span className="block text-xl">⏰</span><span className="text-xs font-bold text-white">{deliveryTime} Mins</span></div>
                             </div>
                             <p className="text-xs text-gray-400 mb-4">{food.description}</p>
                             <button onClick={handleOrder} className="w-full bg-red-600 py-3 rounded-xl font-bold text-sm text-white">Add for ₹{food.price || 150}</button>
                        </div>
                    </div>
                )}
                
                 {/* 4. CHANGE: THE COMMENT SECTION */}
                 {showComments && (
                    <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gray-900 rounded-t-3xl z-40 flex flex-col border-t border-gray-800 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800">
                            <h3 className="font-bold text-sm text-white">Comments ({comments.length})</h3>
                            <button onClick={() => setShowComments(false)} className="text-gray-400">✕</button>
                        </div>
                        
                        {/* THE NEW LOOP */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                             {comments.length > 0 ? (
                                 comments.map((c) => (
                                    <CommentItem 
                                        key={c._id || Math.random()} 
                                        foodId={food._id} 
                                        comment={c} 
                                        refreshData={refreshData} // Pass the refresher
                                    />
                                 ))
                             ) : (
                                 <div className="text-center text-gray-500 mt-10 text-xs">
                                     No comments yet. Be the first!
                                 </div>
                             )}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-800">
                            <input 
                                className="w-full bg-black text-white rounded-full px-4 py-2 border border-gray-700 focus:outline-none text-xs focus:border-red-500 transition-colors" 
                                placeholder="Add a comment..." 
                                value={commentText} 
                                onChange={e=>setCommentText(e.target.value)}
                            />
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoReel;