import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BikeSafetyApp() {
  const [waypoints, setWaypoints] = useState([]);
  const [stolenBikes, setStolenBikes] = useState([]);
  const [userLocation, setUserLocation] = useState([51.505, -0.09]); // Default location
  const [userMarker, setUserMarker] = useState(null); // State to store user marker
  const map = useRef(null);

  const addWaypoint = (e) => {
    setWaypoints([...waypoints, [e.latlng.lat, e.latlng.lng]]);
  };

  const findUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Place a marker at the user's current location
          const newMarker = (
            <Marker position={[latitude, longitude]}>
              <Popup>Your current location: {latitude.toFixed(4)}, {longitude.toFixed(4)}</Popup>
            </Marker>
          );
          setUserMarker(newMarker);

          if (map.current) {
            map.current.setView([latitude, longitude], 16); // Move the map to the user's location
          }
        },
        (error) => {
          console.error("Error getting location: ", error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (map.current) {
      map.current.locate({ setView: true, maxZoom: 16 });

      map.current.on("locationfound", (e) => {
        const { lt, lng } = e.latlng;
        setUserLocation([lt, lng]);
      });

      map.current.on("locationerror", (e) => {
        console.error("Location Error:", e.message);
      });
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bike Safety Tracker</h1>
      
      {/* Button to find the user's current location */}
      <button
        onClick={findUserLocation}
        className="bg-blue-500 text-white py-2 px-4 mb-4 rounded"
      >
        Find My Location
      </button>

      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        ref={map}
        onClick={addWaypoint}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {waypoints.map((pos, index) => (
          <Marker key={index} position={pos}>
            <Popup>Waypoint {index + 1}</Popup>
          </Marker>
        ))}
        {userMarker} {/* Render the user marker if available */}
        <Polyline positions={waypoints} color="blue" />
      </MapContainer>
    </div>
  );
}
