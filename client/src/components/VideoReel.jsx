import React, { useRef, useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { toggleLike, addComment } from '../api/food'; // 1. Import addComment
import { Link } from 'react-router-dom'; 

const VideoReel = ({ food }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const { addToCart } = useCart();
    
    // Social State
    const user = JSON.parse(localStorage.getItem('zomatoUser'));
    const userId = user?.id || user?._id;
    
    const [liked, setLiked] = useState(food.likes?.includes(userId));
    const [likeCount, setLikeCount] = useState(food.likes?.length || 0);
    
    // Comment State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(food.comments || []);
    const [commentText, setCommentText] = useState('');

    const toggleMute = () => {
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
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

        // Optimistic Update
        const newComment = { 
            text: commentText, 
            user: { username: user?.username || "You" }, // Temporary fake user data
            createdAt: new Date() 
        };
        setComments([...comments, newComment]);
        setCommentText('');

        try {
            await addComment(food._id, commentText);
        } catch (error) {
            console.error("Comment failed");
            // Ideally revert state here on failure
        }
    };

    const handleOrder = () => {
        addToCart(food); 
        alert(`🍔 Added ${food.name} to your cart!`); 
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full flex justify-center items-center bg-black snap-start relative overflow-hidden">
            
            <div className="relative w-full max-w-md h-full bg-gray-900">
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

                <button 
                    onClick={toggleMute}
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm z-10"
                >
                    {isMuted ? "🔇" : "🔊"}
                </button>

                {/* --- RIGHT SIDE ACTIONS --- */}
                <div className="absolute bottom-24 right-4 flex flex-col gap-6 items-center z-20">
                    {/* Like Button */}
                    <button onClick={handleLike} className="flex flex-col items-center group">
                        <div className={`p-3 rounded-full bg-black/50 backdrop-blur-sm transition-all transform group-active:scale-90 ${liked ? 'text-red-500' : 'text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-white text-sm font-bold shadow-black drop-shadow-md mt-1">{likeCount}</span>
                    </button>

                    {/* Comment Button (Now Functional!) */}
                    <button onClick={() => setShowComments(true)} className="flex flex-col items-center group">
                        <div className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white transition-all transform group-active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                        </div>
                        <span className="text-white text-sm font-bold shadow-black drop-shadow-md mt-1">{comments.length}</span>
                    </button>
                </div>

                {/* Info Overlay */}
                {/* Info Overlay */}
<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white z-10">
    <div className="flex justify-between items-end">
        <div className="w-3/4">
            <h2 className="text-2xl font-bold mb-1 drop-shadow-md">{food.name}</h2>
            <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-sm">{food.description}</p>
            
            {/* --- REPLACE THE OLD <p> WITH THIS LINK BLOCK --- */}
            <Link to={`/restaurant/${food.foodPartner?._id}`} className="hover:underline z-20 relative inline-block">
                <p className="text-xs text-red-400 mt-2 font-bold uppercase tracking-wider">
                    @{food.foodPartner?.username || "Restaurant"} 
                </p>
            </Link>
            {/* ------------------------------------------------ */}
            
        </div>
        <button onClick={handleOrder} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform active:scale-95 transition-all">
            Order <br/> Now
        </button>
    </div>
</div>
                {/* --- COMMENTS SLIDE-UP PANEL --- */}
                {showComments && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col animate-in slide-in-from-bottom duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h3 className="text-white font-bold">Comments ({comments.length})</h3>
                            <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {comments.length > 0 ? (
                                comments.map((comment, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                                            {comment.user?.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold">{comment.user?.username || "User"}</p>
                                            <p className="text-sm text-white">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center mt-10">No comments yet. Be the first!</p>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-700 bg-gray-900">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..." 
                                    className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                                <button type="submit" className="text-red-500 font-bold px-2">Post</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoReel;