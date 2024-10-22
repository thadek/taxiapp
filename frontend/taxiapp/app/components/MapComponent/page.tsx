"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const icon = L.icon({
  iconUrl: "/lib/images/mapMarker.png",
  iconSize: [35, 46],
  iconAnchor: [17, 46]
});

interface MarkerProps {
  lat: number;
  lng: number;
  display_name: string;
}

interface MapComponentProps {
  markers: MarkerProps[];
}

const MapComponent: React.FC<MapComponentProps> = ({ markers }) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={icon}>
          <Popup>{marker.display_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;