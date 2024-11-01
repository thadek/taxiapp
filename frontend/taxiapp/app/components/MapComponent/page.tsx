"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup,Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useMapState } from '../../hooks/useMapState';



interface MarkerProps {
  lat: number;
  lng: number;
  display_name: string;
}

interface MapComponentProps {
  markers: MarkerProps[];
}


const MapComponent: React.FC = () => {
  const { center, zoom, markers, route, addMarker } = useMapState();

  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-96">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>{marker.display_name}</Popup>
        </Marker>
      ))}
      {route.length > 1 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};
export default MapComponent;