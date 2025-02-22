import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
  CircleMarker,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BikeSafetyApp() {
  const [waypoints, setWaypoints] = useState([]);
  const [stolenBikes, setStolenBikes] = useState([]);
  const map = useRef(null);
  let lat = 38.25;
  let long = -85.738;

  const polyLinePositions = waypoints.map((loc) => [
    loc.ltln.lat,
    loc.ltln.lng,
  ]);

  const mapOnClick = (e) => {
    console.log(e);
    const ltln = e.latlng;
    {
      /*const newWaypoints = waypoints.concat({ ltln });
    console.log(newWaypoints);
    console.log(rock);
    setWaypoints(newWaypoints);
    setWaypoints([...waypoints, [e.latlng.lat, e.latlng.lng]]);
    console.log(waypoints);*/
    }
  };

  function MyComp() {
    const map = useMapEvent("click", (e) => {
      const ltln = e.latlng;
      const newWaypoints = waypoints.concat({ ltln });
      setWaypoints(newWaypoints);
    });
    return null;
  }

  const handleMarkerClick = (index) => {
    console.log("Clicked Waypoint", index);
    if (window.confirm("Delete this Node?")) {
      const newWaypoints = waypoints
        .slice(0, index)
        .concat(waypoints.slice(index + 1));
      setWaypoints(newWaypoints);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bike Safety Tracker</h1>
      <MapContainer
        center={[lat, long]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        ref={map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {waypoints.map((wp, index) => (
          <Marker
            key={index}
            position={[wp.ltln.lat, wp.ltln.lng]}
            eventHandlers={{ click: () => handleMarkerClick(index) }}
          ></Marker>
        ))}
        {/* {waypoints.map((wp, index) => (
          <Circle
            key={index}
            center={[wp.ltln.lat, wp.ltln.lng]}
            radius={50}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
            eventHandlers={{
              click: (event) => handleMarkerClick(event, index),
            }}
          ></Circle>
        ))} */}
        <MyComp />
        <Polyline positions={polyLinePositions} color="blue" />
      </MapContainer>
    </div>
  );
}
