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
  );
}

export default RoutePlanner;
