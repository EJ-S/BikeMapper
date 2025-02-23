import { React, useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import { db } from "./firebase.js";
import { ref, query, get, set, push, orderByChild, equalTo } from "firebase/database";
import {
  Modal,
  Button,
  Box,
  TextField,
  Rating,
  Stack,
  Fab,
} from "@mui/material";

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

export default function SavedRoutes() {

  const [userLocation, setUserLocation] = useState([38.25, -85.738]); // Default location
  const [routeList, setRouteList] = useState([]);
  const [displayRoutes, setDisplayRoutes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const map = useRef(null);
  const navigate = useNavigate();


  async function fetchSavedRoutes (userId)
     {
      let routes = ref(db, 'ROUTES');
      const userRoutesQuery = query(routes, orderByChild("createdBy"), equalTo(userId));
  
      try {
        const instance = await get(userRoutesQuery);
        await get(routes).then(
      (instance) => {
        if (instance.exists()) {
          const v = instance.val();
          let routeObjects = Object.entries(v);

          setRouteList(routeObjects);
        }
      }
    );
        } 
        catch (error)
        {
          console.log(error);
        }
      }
     
      const handleLineClick = (index) => {

        let curRoute = routeList[index];
        console.log("Clicked..." + (curRoute[2]))
        setModalOpen(true);
      }

      const handleModalClose = () => {
        setModalOpen(false);
      };


      useEffect(() => {
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
  
            if (curRoute.length > 0) {
              newDisplayRoutes.push(curRoute);
            }
          }
        })
        setDisplayRoutes(newDisplayRoutes);
      }, [routeList])

    async function handleButtonClick() {
      await fetchSavedRoutes("asd239f293d");
      console.log("routeList:");
      console.log(routeList);
    }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <MapContainer
          center={[38.25, -85.738]}
          zoom={13}
          style={{ height: "calc(100vh - 64px)", width: "100%" }}
        >
        {displayRoutes.map((r, index) => (
            <Polyline 
            positions={r} 
            color="blue"
            eventHandlers={{click: handleLineClick(index)}}
            />
              ))}
        
        <Modal isOpen={modalOpen} onClose={handleModalClose}>
          <Box sx={style}>
              <Stack spacing={2}>
                <Text>Hello World</Text>
              </Stack>
            </Box>
        </Modal>

        <Fab
          variant="extended"
          color="primary"
          aria-label="save"
          onClick={() => handleButtonClick()}
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Show My Routes
        </Fab>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
    </div>
  );
}
