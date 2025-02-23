import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Fab, Box } from "@mui/material";
import { styled } from "@mui/system";
import { db } from "./firebase.js";
import { ref, get } from "firebase/database";

// Import icons
import customIcon1 from "./assets/theif_icon2.png";
import customIcon2 from "./assets/store_icon2.png";
import customIcon3 from "./assets/lock_icon2.png";
import customIcon4 from "./assets/theif_icon.png";
import customIcon5 from "./assets/store_icon.png";
import customIcon6 from "./assets/lock_icon.png";

const ButtonContainer = styled(Box)({
  position: "absolute",
  top: "160px",
  left: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  zIndex: 1000,
});

const iconMappings = {
  "Thief Icon": L.icon({ iconUrl: customIcon4, iconSize: [30, 30] }),
  "Store Icon": L.icon({ iconUrl: customIcon5, iconSize: [30, 30] }),
  "Lock Icon": L.icon({ iconUrl: customIcon6, iconSize: [30, 30] }),
};

function ClickLocater({ setWaypoints, waypoints, selectedWaypointType }) {
  useMapEvent("click", (e) => {
    if (selectedWaypointType) {
      const newWaypoints = [
        ...waypoints,
        { position: [e.latlng.lat, e.latlng.lng], type: selectedWaypointType },
      ];
      setWaypoints(newWaypoints);
    }
  });
  return null;
}

function HomePage() {
  const [waypoints, setWaypoints] = useState([]);
  const [userLocation, setUserLocation] = useState([38.25, -85.738]);
  const [displayRoutes, setDisplayRoutes] = useState([]);
  const [selectedWaypointType, setSelectedWaypointType] = useState(null);
  const map = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/route-planner");
  };

  useEffect(() => {
    if (map.current) {
      map.current.locate({ setView: true, maxZoom: 16 });

      map.current.on("locationfound", (e) => {
        const { lat, lng } = e.latlng;
        setUserLocation([lat, lng]);
      });

      map.current.on("locationerror", (e) => {
        console.error("Location Error:", e.message);
      });
    }
  }, []);

  const fetchAllRoutes = () => {
    let routes = ref(db, "ROUTES");
    console.log("RUNNING");
    get(routes).then((instance) => {
      if (instance.exists()) {
        const v = instance.val();
        console.log(v);
        console.log(typeof v);
        let routeList = Object.entries(v);

        let newDisplayRoutes = [];

        routeList.forEach((o) => {
          if (o[1].nodes) {
            let curRoute = [];

            let route = Object.entries(o[1].nodes);
            route.forEach((el) => {
              if (el) {
                curRoute.push(el[1]);
              }
            });

            console.log(curRoute);
            if (curRoute.length > 0) {
              newDisplayRoutes.push(curRoute);
            }
          }
        });

        setDisplayRoutes(newDisplayRoutes);
      }
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "calc(100vh - 64px)", width: "100%" }}
          ref={map}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickLocater
            setWaypoints={setWaypoints}
            waypoints={waypoints}
            selectedWaypointType={selectedWaypointType}
          />
          {waypoints.map((wp, index) => (
            <Marker
              key={index}
              position={wp.position}
              icon={iconMappings[wp.type]}
            >
              <Popup>{wp.type}</Popup>
            </Marker>
          ))}
          {displayRoutes.map((r, index) => (
            <Polyline key={index} positions={r} color="blue" />
          ))}
        </MapContainer>
      </div>

      {/* Floating Action Buttons (FABs) */}
      <ButtonContainer>
        <Fab variant="extended" onClick={() => setSelectedWaypointType("Thief Icon")}>
          <img src={customIcon1} alt="Thief Icon" width={30} height={30} />
        </Fab>
        <Fab variant="extended" onClick={() => setSelectedWaypointType("Store Icon")}>
          <img src={customIcon2} alt="Store Icon" width={30} height={30} />
        </Fab>
        <Fab variant="extended" onClick={() => setSelectedWaypointType("Lock Icon")}>
          <img src={customIcon3} alt="Lock Icon" width={30} height={30} />
        </Fab>
      </ButtonContainer>

      {/* Show Routes Button */}
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

      {/* Route Planner Button */}
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
