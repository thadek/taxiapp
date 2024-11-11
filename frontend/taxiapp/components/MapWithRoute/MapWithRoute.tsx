'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useQuery } from '@tanstack/react-query';
import { getDirection } from '@/app/queries/maps';
import { Progress } from '@nextui-org/progress';
import { toast } from 'sonner';
import { Spinner } from '@nextui-org/react';
import EstimationCard from '../EstimationCard/EstimationCard';
import TaxiAppSkeleton from '@/components/taxiapp-skeleton';


const MapWithRoute = ({ start, end, turno }: { start: any, end: any, turno: any }) => {
  const [route, setRoute] = useState([]);


  const { data, isSuccess, isLoading, error } = useQuery({ queryKey: ['routecalc',start,end], queryFn: () => getDirection(start, end) });

  
  useEffect(() => {
   
    if (!isLoading &&data.routes && data.routes.length > 0) {
      const coordinates = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
      setRoute(coordinates);
    }
  }, [isSuccess]);







  if (isLoading) {
  return (<div className="w-full h-[20vh] flex justify-center items-center">
    <TaxiAppSkeleton/>
  </div>)
  }
  
    if (data.error || error) {
      toast.error('Error al calcular ruta');
      return (<></>)
    }
  
    return (isSuccess && !data.error &&  <div className="flex flex-col w-full h-full relative">
      <MapContainer center={[start[1], start[0]]} zoom={13} className="w-full h-[80vh] z-10">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {(route.length > 0) && <Polyline positions={route} pathOptions={{ color: 'blue' }} />}
        <Marker position={[start[1], start[0]]}>
          <Popup>Origen</Popup>
        </Marker>
        <Marker position={[end[1], end[0]]}>
          <Popup>Destino</Popup>
        </Marker>
      </MapContainer>
      
      <EstimationCard start={start} end={end} distance={data.routes[0].distance} shift={turno} />
    
      </div>
    )
};

export default MapWithRoute;