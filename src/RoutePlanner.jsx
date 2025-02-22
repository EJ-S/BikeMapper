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

function RoutePlanner() {
  const [waypoints, setWaypoints] = useState([]);
  const map = useRef(null);
  let lat = 38.25;
  let long = -85.738;

  const navigate = useNavigate();

  const polyLinePositions = waypoints.map((loc) => [
    loc.ltln.lat,
    loc.ltln.lng,
  ]);

  function ClickLocater() {
    const map = useMapEvent("click", (e) => {
      const ltln = e.latlng;
      const newWaypoints = waypoints.concat({ ltln });
      setWaypoints(newWaypoints);
    });
    return null;
  }

  const goHome = () => {
    navigate("/");
  };

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
    <div>
      <h1>Plan A Route</h1>
      <button onClick={goHome}>Go Home</button>
      <MapContainer
        center={[lat, long]}
        zoom={13}
        style={{ height: "500px", width: "500px" }}
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
        <ClickLocater />
        <Polyline positions={polyLinePositions} color="blue" />
      </MapContainer>
    </div>
    // <div>
    //   <MapContainer
    //     center={[lat, long]}
    //     zoom={13}
    //     style={{ height: "100%", width: "100%" }}
    //     ref={map}
    //   >
    //     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    //     {waypoints.map((wp, index) => (
    //       <Marker
    //         key={index}
    //         position={[wp.ltln.lat, wp.ltln.lng]}
    //         eventHandlers={{ click: () => handleMarkerClick(index) }}
    //       ></Marker>
    //     ))}
    //     {/* {waypoints.map((wp, index) => (
    //       <Circle
    //         key={index}
    //         center={[wp.ltln.lat, wp.ltln.lng]}
    //         radius={50}
    //         pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
    //         eventHandlers={{
    //           click: (event) => handleMarkerClick(event, index),
    //         }}
    //       ></Circle>
    //     ))} */}
    //     <ClickLocater />
    //     <Polyline positions={polyLinePositions} color="blue" />
    //   </MapContainer>
    // </div>
  );
}

export default RoutePlanner;
