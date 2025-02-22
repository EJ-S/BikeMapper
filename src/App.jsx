import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BikeSafetyApp() {
  const [waypoints, setWaypoints] = useState([]);
  const [stolenBikes, setStolenBikes] = useState([]);

  const addWaypoint = (e) => {
    setWaypoints([...waypoints, [e.latlng.lat, e.latlng.lng]]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bike Safety Tracker</h1>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        onClick={addWaypoint}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map((pos, index) => (
          <Marker key={index} position={pos}>
            <Popup>Waypoint {index + 1}</Popup>
          </Marker>
        ))}
        <Polyline positions={waypoints} color="blue" />
      </MapContainer>
    </div>
  );
}

