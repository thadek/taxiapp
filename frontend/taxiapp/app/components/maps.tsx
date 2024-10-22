"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const icon = L.icon({
  iconUrl: "/lib/images/mapMarker.png",
  iconSize: [22.5, 36],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const position: [number, number] = [-38.955671, -68.074888];

const MapComponent = () => {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=3zvZAXhYCr2Vn7hYCR1u"
            />
            <Marker position={position} icon={icon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      );
};

export default MapComponent;