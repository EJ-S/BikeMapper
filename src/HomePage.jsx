import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar

function HomePage() {
  const [waypoints, setWaypoints] = useState([]);
  const [userLocation, setUserLocation] = useState([38.25, -85.738]); // Default location
  const map = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/route-planner");
  };

  const addWaypoint = (e) => {
    setWaypoints([...waypoints, [e.latlng.lat, e.latlng.lng]]);
  };

  useEffect(() => {
    if (map.current) {
      map.current.locate({ setView: true, maxZoom: 16 });

      map.current.on("locationfound", (e) => {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]); // ✅ Update state correctly
      });

      map.current.on("locationerror", (e) => {
        console.error("Location Error:", e.message);
      });
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "calc(100vh - 64px)", width: "100%" }} // Adjust height to fit below navbar
          ref={map}
          onClick={addWaypoint}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {waypoints.map((pos, index) => (
            <Marker key={index} position={pos}>
              <Popup>Waypoint {index + 1}</Popup>
            </Marker>
          ))}
          <Polyline positions={waypoints} color="blue" />
        </MapContainer>
      </div>
      <button
        onClick={handleButtonClick}
        className="absolute top-[80px] right-4 p-2 bg-blue-500 text-white rounded shadow-lg"
      >
        Go to Route Planner
      </button>
    </div>
  );
}

export default HomePage;
