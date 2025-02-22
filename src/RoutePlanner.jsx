import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar

function RoutePlanner() {
  const [waypoints, setWaypoints] = useState([]);
  const [userLocation, setUserLocation] = useState([38.25, -85.738]); // Default location
  const map = useRef(null);
  const navigate = useNavigate();

  const polyLinePositions = waypoints.map((loc) => [
    loc.latlng.lat,
    loc.latlng.lng,
  ]);

  function ClickLocater() {
    useMapEvent("click", (e) => {
      const latlng = e.latlng;
      setWaypoints((prevWaypoints) => [...prevWaypoints, { latlng }]);
    });
    return null;
  }

  const goHome = () => {
    navigate("/");
  };

  const handleMarkerClick = (index) => {
    console.log("Clicked Waypoint", index);
    if (window.confirm("Delete this Node?")) {
      setWaypoints((prevWaypoints) =>
        prevWaypoints.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "calc(100vh - 64px)", width: "100%" }} // Map fills screen under navbar
          ref={map}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {waypoints.map((wp, index) => (
            <Marker
              key={index}
              position={[wp.latlng.lat, wp.latlng.lng]}
              eventHandlers={{ click: () => handleMarkerClick(index) }}
            />
          ))}
          <ClickLocater />
          <Polyline positions={polyLinePositions} color="blue" />
        </MapContainer>
      </div>
      <button
        onClick={goHome}
        className="absolute top-[80px] right-4 p-2 bg-red-500 text-white rounded shadow-lg"
      >
        Go Home
      </button>
    </div>
  );
}

export default RoutePlanner;
