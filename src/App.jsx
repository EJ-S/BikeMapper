import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BikeSafetyApp() {
  const [waypoints, setWaypoints] = useState([]);
  const [stolenBikes, setStolenBikes] = useState([]);
  const map = useRef(null);
  let lat = 0;
  let long = 0;

  const addWaypoint = (e) => {
    setWaypoints([...waypoints, [e.latlng.lat, e.latlng.lng]]);
  };

  useEffect(() => {
    console.log("running");
    if (map.current) {
      map.current.locate({ setView: true, maxZoom: 16 });

      map.current.on("locationfound", (e) => {
        alert(e.latlng);
        const { lt, lng } = e.latlng;
        lat = lt;
        long = lng;
      });

      map.current.on("locationerror", (e) => {
        console.error("Location Error:", e.message);
      });
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bike Safety Tracker</h1>
      <MapContainer
        center={[lat, long]}
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
        <Polyline positions={waypoints} color="blue" />
      </MapContainer>
    </div>
  );
}
