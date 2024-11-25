"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import "leaflet-defaulticon-compatibility";
import CarSVG from "../carSVG";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import useWebSocketSubscription from "@/hooks/useSocket";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  color: string;
  status: string;
  year: number;
  details: string;
  driver: {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email: string;
    is_disabled: null | boolean;
    rating: string;
    licenseId: string;
    isAvailable: boolean;
  };
}

interface VehicleData {
  id: number;
  position: [number, number];
  angle: number;
  vehicle: Vehicle;
}


type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'STREET_TRIP' | 'BUSY' | 'UNAVAILABLE';

    const parseStatus: Record<VehicleStatus, { detail: string; color: 'warning' | 'primary' | 'success' | 'danger' }> = {
        AVAILABLE: { detail: 'Disponible', color: 'warning' },
        ON_TRIP: { detail: 'Viaje en curso', color: 'primary' },
        STREET_TRIP: { detail: 'Viaje de calle', color: 'success' },
        BUSY: { detail: 'Ocupado', color: 'success' },
        UNAVAILABLE: { detail: 'No disponible', color: 'danger' },
    }





export default function RTLMapComponent() {
  const initialPosition: LatLngExpression = [-38.951155, -68.065541];
  const { message } = useWebSocketSubscription(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`,
    "/topic/locations"
  );

  const [vehicles, setVehicles] = useState<Record<number, VehicleData>>({});

  // Función para determinar el color del auto según su estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "AVAILABLE":
        return "green";
      case "ON_TRIP":
        return "blue";
      case "UNAVAILABLE":
        return "red";
      default:
        return "gray";
    }
  };

  // Genera un icono SVG con color dinámico
  const svgCar = (angle: number, color: string) =>
    L.divIcon({
      html: `
        <div class='svg-icon' style="transform: rotate(360deg);">
          ${CarSVG.replace('currentColor', color)}
        </div>
      `,
      className: "car-icon",
    });

  const gpsDirectionAngleCalc = (currentPoint: [number, number], newPoint: [number, number]) => {
    const [lat1, lon1] = currentPoint;
    const [lat2, lon2] = newPoint;
    const deltaX = lat2 - lat1;
    const deltaY = lon2 - lon1;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  useEffect(() => {
    if (message) {
      const parsedMessage = typeof message === "string" ? JSON.parse(message) : message;
      const { x, y, vehicle } = parsedMessage;

      setVehicles((prev) => {
        const currentData = prev[vehicle.id];
        const newPosition: [number, number] = [x, y];
        const newAngle = currentData
          ? gpsDirectionAngleCalc(currentData.position, newPosition)
          : 0;

        return {
          ...prev,
          [vehicle.id]: {
            id: vehicle.id,
            position: newPosition,
            angle: newAngle,
            vehicle,
          },
        };
      });
    }
  }, [message]);

  return (
    <MapContainer center={initialPosition} zoom={13} className="w-full h-full z-10">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.values(vehicles).map(({ id, position, angle, vehicle }) => (
        <Marker
          key={id}
          position={position}
          icon={svgCar(angle, getStatusColor(vehicle.status))}
        >
          <Popup>
            <strong>{vehicle.brand} {vehicle.model}</strong><br />
            Placa: {vehicle.licensePlate}<br />
            Conductor: {vehicle.driver.name} {vehicle.driver.lastname}<br />
            Estado: {parseStatus[vehicle.status as VehicleStatus].detail}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
