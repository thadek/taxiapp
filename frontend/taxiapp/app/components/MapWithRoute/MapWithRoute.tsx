'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapWithRoute = ({ start, end }:{start:any,end:any}) => {
  const [route, setRoute] = useState([]);
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRoute = async () => {
      const response = await fetch(`/api/maps/directions?start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`);
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    };
    getRoute();
  }, [start, end]);

  useEffect(() => {
    if (data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry.coordinates.map((coord:any) => [coord[1], coord[0]]);
      setRoute(coordinates);
    }
  }, [data]);

 

  return (
    <MapContainer center={start} zoom={13} className="w-full h-[100vh] z-10">
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {(route.length > 0) && <Polyline positions={route} pathOptions={{color:'blue'}} />}
      <Marker position={start}>
        <Popup>Origen</Popup>
      </Marker>
      <Marker position={end}>
        <Popup>Destino</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithRoute;