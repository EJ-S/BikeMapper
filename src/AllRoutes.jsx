import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";

export default function AllRoutes() {
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
        </MapContainer>
      </div>
    </div>
  );
}
