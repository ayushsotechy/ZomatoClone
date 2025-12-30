import React, { useEffect, useState } from 'react';
import { getAllFoods } from '../api/food';
import VideoReel from '../components/VideoReel';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await getAllFoods();
                // The backend sends { message: "...", data: [...] }
                // So we set foods to response.data
                setFoods(response.data);
            } catch (error) {
                console.error("Failed to load feed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    if (loading) return <div className="text-center mt-20 text-xl">Loading delicious reels... 🍟</div>;

    return (
        <div className="bg-black h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth">
            {foods.length > 0 ? (
                foods.map((food) => (
                    <VideoReel key={food._id} food={food} />
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-white snap-start">
                    <p className="text-2xl">No reels yet! 😢</p>
                    <p className="text-gray-400">Be the first partner to upload one.</p>
                </div>
            )}
        </div>
    );
};

export default Home;