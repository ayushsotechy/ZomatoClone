import React, { useEffect, useState } from 'react';
import VideoReel from '../components/VideoReel';
import { getAllFoods } from '../api/food';

const Home = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getAllFoods();
        // Robust data handling to prevent crashes
        if (Array.isArray(response)) setFoods(response);
        else if (response.data && Array.isArray(response.data)) setFoods(response.data);
        else if (response.foods && Array.isArray(response.foods)) setFoods(response.foods);
        else setFoods([]);
      } catch (error) {
        console.error("Failed to fetch foods", error);
        setFoods([]); 
      }
    };
    fetchFoods();
  }, []);

  return (
    // CONTAINER FIX (Applied here):
    // Mobile: h-[calc(100dvh-70px)] -> Stops exactly above the bottom nav bar.
    // Desktop: md:h-screen -> Uses full height on PC.
    <div className="w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black 
                    h-[calc(100dvh-70px)] md:h-screen"> 
      
      {Array.isArray(foods) && foods.length > 0 ? (
        foods.map((food) => (
          <VideoReel key={food._id} food={food} />
        ))
      ) : (
        <div className="h-full flex items-center justify-center text-white">
            <p>Loading tasty reels...</p>
        </div>
      )}
    </div>
  );
};

export default Home;