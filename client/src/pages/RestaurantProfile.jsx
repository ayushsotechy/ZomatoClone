import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPartnerFoods } from '../api/food';
import VideoReel from '../components/VideoReel'; // We can reuse this!

const RestaurantProfile = () => {
    const { id } = useParams(); // Get ID from URL
    const [foods, setFoods] = useState([]);
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getPartnerFoods(id);
                setFoods(data.data);
                setPartner(data.partner);
            } catch (error) {
                console.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Loading Kitchen... 👨‍🍳</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Profile Section */}
            <div className="bg-gray-900 p-8 flex flex-col items-center border-b border-gray-800 sticky top-0 z-10">
                <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                    {partner?.username?.[0]?.toUpperCase() || "R"}
                </div>
                <h1 className="text-3xl font-bold">{partner?.username || "Restaurant"}</h1>
                <p className="text-gray-400 mt-2">@{partner?.email?.split('@')[0]}</p>
                <div className="flex gap-6 mt-6">
                    <div className="text-center">
                        <span className="font-bold text-xl block">{foods.length}</span>
                        <span className="text-sm text-gray-500">Reels</span>
                    </div>
                    <div className="text-center">
                        <span className="font-bold text-xl block">0</span>
                        <span className="text-sm text-gray-500">Followers</span>
                    </div>
                </div>
            </div>

            {/* Video Grid / Feed */}
            <div className="max-w-md mx-auto">
                {foods.map((food) => (
                    // We reuse VideoReel but simpler? 
                    // Actually, let's just show the full reels list for now like TikTok profile
                    <div key={food._id} className="border-b border-gray-800">
                        <VideoReel food={food} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantProfile;