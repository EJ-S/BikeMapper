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
import {Fab} from "@mui/material";

import { db } from "./firebase.js";
import { ref, get, set, push } from "firebase/database";

function HomePage() {
  const [waypoints, setWaypoints] = useState([]);
  const [userLocation, setUserLocation] = useState([38.25, -85.738]); // Default location
  const [displayRoutes, setDisplayRoutes] = useState([]);
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
        setUserLocation([lat, lng]); // Update state correctly
      });

      map.current.on("locationerror", (e) => {
        console.error("Location Error:", e.message);
      });
    }
  }, []);

  const fetchAllRoutes = () => {
    let routes = ref(db, 'ROUTES');
    console.log("RUNNING");
    get(routes).then(
      (instance) => {
        if (instance.exists()) {
          const v = instance.val();
          console.log(v);
          console.log(typeof(v));
          let routeList = Object.entries(v);

          let newDisplayRoutes = [];

          routeList.forEach(o => {
            if(o[1].nodes) {

              let curRoute = [];

              let route = Object.entries(o[1].nodes);
              route.forEach((el) => {
                if (el) {
                  curRoute.push(el[1]);
                }
              })

              console.log(curRoute);
              if (curRoute.length > 0) {
                newDisplayRoutes.push(curRoute);
              }
            }
          })

          setDisplayRoutes(newDisplayRoutes);
        }
      }
    );
  }

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
          {displayRoutes.map((r, index) => (
            <Polyline positions={r} color="blue" />
          ))}
        </MapContainer>
      </div>
      <Fab
          variant="extended"
          color="primary"
          aria-label="save"
          onClick={() => fetchAllRoutes()}
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Show Routes
        </Fab>
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
