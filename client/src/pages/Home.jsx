import React, { useEffect, useState } from 'react';
import VideoReel from '../components/VideoReel';
import { getAllFoods } from '../api/food';

const Home = () => {
  // 1. Initialize with an empty array to prevent initial render errors
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getAllFoods();
        
        console.log("API Response:", response); // Check console to see structure!

        // 2. SAFETY CHECK: Extract the array correctly
        if (Array.isArray(response)) {
            // Case A: Backend returns straight array [...]
            setFoods(response);
        } else if (response.data && Array.isArray(response.data)) {
            // Case B: Backend returns { success: true, data: [...] }
            setFoods(response.data);
        } else if (response.foods && Array.isArray(response.foods)) {
            // Case C: Backend returns { foods: [...] }
            setFoods(response.foods);
        } else {
            console.error("Unexpected data format. Expected an array.", response);
            setFoods([]); // Fallback to empty to prevent crash
        }

      } catch (error) {
        console.error("Failed to fetch foods", error);
        setFoods([]); 
      }
    };
    fetchFoods();
  }, []);

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {/* 3. DOUBLE SAFETY: Only map if 'foods' is actually an array with items */}
      {Array.isArray(foods) && foods.length > 0 ? (
        foods.map((food) => (
          <VideoReel key={food._id} food={food} />
        ))
      ) : (
        /* Optional: Loading State or Empty Message */
        <div className="h-screen flex items-center justify-center text-white">
            <p>Loading or no foods found...</p>
        </div>
      )}
    </div>
  );
};

export default Home;