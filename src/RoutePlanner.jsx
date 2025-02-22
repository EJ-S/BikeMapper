import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar
import { Modal, Button, Box, TextField, Rating, Stack } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function RoutePlanner() {
  const [waypoints, setWaypoints] = useState([]);
  const [open, setOpen] = useState(false);
  const [routeRating, setRouteRating] = useState(1);
  const [routeName, setRouteName] = useState("");
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

  const openModal = () => {
    setOpen(true);
  };

  const saveRoute = () => {
    let dist = 0; // in meters
    let center = [0, 0]; // in coordinates
    for (var i = 0; i < waypoints.length - 1; i++) {
      dist += L.latLng(waypoints[i].ltln).distanceTo(
        L.latLng(waypoints[i + 1].ltln)
      );
    }
    waypoints.map((location) => {
      center[0] += location.ltln.lat;
      center[1] += location.ltln.lng;
    });
    if (waypoints.length > 0) {
      center[0] = center[0] / waypoints.length;
      center[1] = center[1] / waypoints.length;
    }
    console.log("Route Distance:", dist);
    console.log("Route Center:", center);
    console.log("Route Name:", routeName);
    console.log("Route Rating:", routeRating);
    console.log("Points:", polyLinePositions);
    setOpen(false);
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
          center={[38.25, -85.738]} 
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
      <Button onClick={openModal} variant="contained">
        Save this Route
      </Button>
      <Modal onClose={saveRoute} open={open}>
        <Box sx={style}>
          <Stack>
            <TextField
              id="route-name"
              label="Route Name"
              variant="outlined"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
            <Rating
              name="route-rating"
              value={routeRating}
              onChange={(event, newRouteRating) => {
                setRouteRating(newRouteRating);
              }}
            />
            <Button varient="contained" onClick={saveRoute}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
      </div>
    </div>
  );
}

export default RoutePlanner;
