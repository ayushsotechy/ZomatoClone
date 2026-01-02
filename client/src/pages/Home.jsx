import React, { useEffect, useState } from 'react';
import VideoReel from '../components/VideoReel';
import { getAllFoods } from '../api/food';
// ❌ Remove CommentItem import from here (it belongs in VideoReel)

const Home = () => {
  const [foods, setFoods] = useState([]);

  // 1. Define this function OUTSIDE useEffect so we can pass it down
  const fetchFoods = async () => {
    try {
      const response = await getAllFoods();
      if (Array.isArray(response)) setFoods(response);
      else if (response.data && Array.isArray(response.data)) setFoods(response.data);
      else if (response.foods && Array.isArray(response.foods)) setFoods(response.foods);
      else setFoods([]);
    } catch (error) {
      console.error("Failed to fetch foods", error);
      setFoods([]); 
    }
  };

  useEffect(() => {
    fetchFoods(); // Call it when component mounts
  }, []);

  return (
    <div className="w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black 
                    h-[calc(100dvh-70px)] md:h-screen"> 
      
      {Array.isArray(foods) && foods.length > 0 ? (
        foods.map((food) => (
          <VideoReel 
            key={food._id} 
            food={food} 
            refreshData={fetchFoods} // ✅ PASS THIS DOWN!
          />
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