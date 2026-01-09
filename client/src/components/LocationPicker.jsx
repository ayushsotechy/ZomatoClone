import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // ✅ Added useMap
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HELPER COMPONENT: Recenter Map when position changes ---
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom()); // Fly to new coordinates
    }, [lat, lng]);
    return null;
};

const LocationPicker = ({ onConfirm }) => {
  // Default to New Delhi (Fallback)
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const markerRef = useRef(null);

  // --- 1. FUNCTION TO GET LIVE LOCATION ---
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("Live Location Fetched:", latitude, longitude);
          setPosition({ lat: latitude, lng: longitude });
          setIsConfirmed(false); // Reset confirmation so they have to confirm again
        },
        (err) => {
          console.error("Error fetching location:", err);
          alert("Could not fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // --- 2. AUTO-FETCH ON MOUNT (Optional) ---
  useEffect(() => {
      handleLocateMe();
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          setIsConfirmed(false);
        }
      },
    }),
    [],
  );

  const handleConfirm = () => {
      setIsConfirmed(true);
      if (onConfirm) {
          onConfirm(position);
      }
  };

  return (
    <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📍 Delivery Location
          </h2>
          
          {/* LOCATE ME BUTTON */}
          <button 
            onClick={handleLocateMe}
            className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-blue-400 px-3 py-1 rounded-full transition-all border border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Locate Me
          </button>
      </div>
      
      <div className="relative rounded-xl overflow-hidden border border-gray-700 group">
        <MapContainer 
            center={position} 
            zoom={15} // Zoomed in a bit more for accuracy
            scrollWheelZoom={true} 
            style={{ height: "300px", width: "100%" }}
        >
            {/* The Magic Component to move the camera */}
            <RecenterMap lat={position.lat} lng={position.lng} />

            <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Popup minWidth={90}>
                    <span className="text-black font-bold">
                    You are here!
                    </span>
                </Popup>
            </Marker>
        </MapContainer>

        {/* Floating Instruction Overlay */}
        {!isConfirmed && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full z-[1000] border border-white/10 pointer-events-none">
                Drag map marker to pinpoint
            </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {isConfirmed ? (
             <span className="text-green-500 text-sm font-bold flex items-center gap-1">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
               Location Saved
            </span>
        ) : (
            <span className="text-gray-500 text-xs">Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}</span>
        )}

        <button 
            onClick={handleConfirm}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                isConfirmed 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
            }`}
            disabled={isConfirmed}
        >
            {isConfirmed ? "Confirmed" : "Confirm Location"}
        </button>
      </div>
    </div>
  );
}

export default LocationPicker;