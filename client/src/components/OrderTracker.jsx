import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './RoutingMachine';
import { axiosInstance } from '../config/axios';

// --- ICONS ---
const restaurantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4064/4064217.png',
    iconSize: [40, 40],
});

const bikeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
    iconSize: [45, 45],
});

const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png',
    iconSize: [40, 40],
});

// ✅ Added 'orderId' to props
const OrderTracker = ({ userLocation, restaurantLocation, orderStatus, orderId }) => {
    
    const [riderPos, setRiderPos] = useState(restaurantLocation);
    const [routeCoords, setRouteCoords] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState("Finding best route...");
    const [progress, setProgress] = useState(0);

    // --- ANIMATION EFFECT ---
    useEffect(() => {
        if (routeCoords.length === 0) return;

        // ✅ LOGIC FIX: CHECK IF ALREADY DELIVERED
        if (orderStatus === 'Delivered') {
            // Jump to the end immediately
            const lastPoint = routeCoords[routeCoords.length - 1];
            setRiderPos(lastPoint);
            setProgress(100);
            setStatus("Order Delivered! Enjoy 🥘");
            return; // 🛑 EXIT HERE (Do not start animation loop)
        }

        // If NOT delivered, start the simulation loop
        const totalPoints = routeCoords.length;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                
                // 🏁 CHECK IF FINISHED
                if (prevIndex >= totalPoints - 1) {
                    clearInterval(interval);
                    setStatus("Order Delivered! Enjoy 🥘");
                    
                    // ✅ MAGIC MOMENT: CALL BACKEND TO SAVE "DELIVERED"
                    // We check 'orderStatus' first to ensure we don't call API twice
                    if (orderStatus !== 'Delivered') {
                        console.log("Bike arrived! Updating database...");
                        
                        axiosInstance.post('/orders/update-status', {
                            orderId: orderId,
                            status: 'Delivered'
                        })
                        .then(() => {
                            console.log("Database updated successfully!");
                            // Optional: Reload page to show green tag
                            // window.location.reload(); 
                        })
                        .catch(err => console.error("Failed to update status", err));
                    }

                    return prevIndex;
                }

                // ... (rest of animation logic) ...
                
                const pct = Math.round((prevIndex / totalPoints) * 100);
                setProgress(pct);

                if(pct < 5) setStatus("Rider picked up order");
                else if(pct < 80) setStatus("On the way...");
                else setStatus("Rider is arriving soon!");

                // Speed factor
                return prevIndex + 2; 
            });
        }, 100);

        return () => clearInterval(interval);
    }, [routeCoords, orderStatus, orderId]); // ✅ Added orderId dependency

    // --- SYNC RIDER POSITION ---
    useEffect(() => {
        // Only update position if we are NOT in "Delivered" mode 
        // (Delivered mode sets position manually above)
        if (orderStatus !== 'Delivered' && routeCoords[currentIndex]) {
            setRiderPos(routeCoords[currentIndex]);
        }
    }, [currentIndex, routeCoords, orderStatus]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* STATUS BAR */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-white">{status}</h3>
                    <span className={`font-mono text-sm font-bold ${orderStatus === 'Delivered' ? 'text-green-500' : 'text-red-500'}`}>
                        {progress}%
                    </span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                        className={`${orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-red-600'} h-full transition-all duration-300 ease-out`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden border border-gray-800 h-[400px] w-full relative z-0">
                <MapContainer 
                    center={restaurantLocation} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <RoutingMachine 
                        userLocation={userLocation} 
                        restaurantLocation={restaurantLocation}
                        onRouteFound={(coords) => setRouteCoords(coords)}
                    />

                    <Marker position={restaurantLocation} icon={restaurantIcon}>
                        <Popup>Restaurant</Popup>
                    </Marker>

                    <Marker position={userLocation} icon={homeIcon}>
                        <Popup>Delivery Location</Popup>
                    </Marker>

                    {/* Rider Marker */}
                    <Marker position={riderPos} icon={bikeIcon}>
                        <Popup>Your Rider</Popup>
                    </Marker>

                </MapContainer>
            </div>
        </div>
    );
};

export default OrderTracker;
