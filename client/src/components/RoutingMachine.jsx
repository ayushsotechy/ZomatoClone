import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const RoutingMachine = ({ userLocation, restaurantLocation, onRouteFound }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // 1. Create the Routing Control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(restaurantLocation.lat, restaurantLocation.lng), // Start
        L.latLng(userLocation.lat, userLocation.lng)              // End
      ],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 5, opacity: 0.8 }] // Sleek Uber-like Blue Line
      },
      show: false, // Hide the text instructions box
      addWaypoints: false, // Disable dragging points
      routeWhileDragging: false,
      fitSelectedRoutes: true, // Auto-zoom to fit the route
      showAlternatives: false,
      createMarker: function() { return null; } // Hide default start/end markers (we use our own custom ones)
    });

    // 2. Add it to the map
    routingControl.addTo(map);

    // 3. LISTEN FOR THE ROUTE! 
    // This is where the magic happens. We grab the list of coordinates.
    routingControl.on('routesfound', function (e) {
      const routes = e.routes;
      const coordinates = routes[0].coordinates; // Array of {lat, lng} objects representing the path
      
      // Send these coordinates back to the parent component
      if (onRouteFound) {
          onRouteFound(coordinates);
      }
    });

    // Cleanup when component unmounts
    return () => {
        // Safe removal check
        try {
            map.removeControl(routingControl);
        } catch (e) {
            console.warn("Map control cleanup error", e);
        }
    };
  }, [map, userLocation, restaurantLocation]);

  return null;
};

export default RoutingMachine;