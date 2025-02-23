import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import {
  Box,
  Fab,
  Slider,
  Modal,
  Stack,
  Button,
  Typography,
} from "@mui/material";

import { db } from "./firebase.js";
import { ref, get, set, push } from "firebase/database";

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

export default function AllRoutes() {
  const [open, setOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]);
  const [displayRoutes, setDisplayRoutes] = useState([]);
  const [filterDiff, setFilterDiff] = useState(3);
  const [filterDistance, setFilterDistance] = useState(10000000);

  useEffect(() => {
    console.log("Page loaded! Running query...");
    fetchAllRoutes();
  }, []); // Runs only once when the component mounts

  const handleDiffChange = (event, newValue) => {
    setFilterDiff(newValue);
  };

  const handleDistChange = (event, newValue) => {
    setFilterDistance(newValue);
  };

  // const filter = () => {};
  const filter = (dist, diff) => {
    let newDisplayRoutes = [];
    allRoutes.forEach((o) => {
      if (o[1].nodes) {
        let curRoute = [];

        console.log(o[1]);

        let route = Object.entries(o[1].nodes);
        let d = o[1].distance;
        let r = o[1].rating;
        console.log("Dist:", d, "Rating:", r);
        if (d <= dist && r == diff) {
          route.forEach((el) => {
            if (el) {
              curRoute.push(el[1]);
            }
          });
        }

        console.log(curRoute);
        if (curRoute.length > 0) {
          newDisplayRoutes.push(curRoute);
        }
      }
    });
    setDisplayRoutes(newDisplayRoutes);
    setOpen(false);
  };

  const fetchAllRoutes = () => {
    let routes = ref(db, "ROUTES");
    console.log("RUNNING");
    get(routes).then((instance) => {
      if (instance.exists()) {
        const v = instance.val();

        let routeList = Object.entries(v);

        setAllRoutes(routeList);
      }
    });
  };

  useEffect(() => {
    let newDisplayRoutes = [];
    allRoutes.forEach((o) => {
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
  }, [allRoutes]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <MapContainer
          center={[38.25, -85.738]}
          zoom={13}
          style={{ height: "calc(100vh - 64px)", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {displayRoutes.map((r, index) => (
            <Polyline positions={r} color="blue" />
          ))}
        </MapContainer>
        <Fab
          variant="extended"
          color="primary"
          aria-label="save"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Filter Routes
        </Fab>
        {/* Save Route Modal */}
        <Modal onClose={() => setOpen(false)} open={open}>
          <Box sx={style}>
            <Stack spacing={2}>
              <Typography color="textPrimary">Distance</Typography>
              <Slider
                min={0}
                max={100000}
                valueLabelDisplay="on"
                value={filterDistance}
                onChange={handleDistChange}
              />
              <Typography color="textPrimary">Rating</Typography>
              <Slider
                defaultValue={3}
                step={1}
                marks
                min={1}
                max={5}
                value={filterDiff}
                valueLabelDisplay="on"
                onChange={handleDiffChange}
              />
              <Button
                variant="contained"
                onClick={() => filter(filterDistance, filterDiff)}
              >
                Filter
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
