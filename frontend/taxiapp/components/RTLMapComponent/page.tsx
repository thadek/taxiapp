"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import CarSVG from "../carSVG";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import useWebSocketSubscription from '@/hooks/useSocket';
import { toast } from "sonner";

interface MarkerProps {
    lat: number;
    lng: number;
    display_name: string;
}

/*function EvtClickMapa({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        }
    });
    return null;
}*/

export default function RTLMapComponent() {
    const position = [-38.951155, -68.065541];
    const { message } = useWebSocketSubscription('http://localhost:8080/api/v1/ws', '/topic/locations'); 

    const [carPosition, setCarPosition] = useState<[number, number]>([-38.951155, -68.065541]);
    const [previousPosition, setPreviousPosition] = useState<[number, number]>([-38.951155, -68.065541]);
    const [carAngle, setCarAngle] = useState(0);

    const svgCar = L.divIcon({
        html: `<div class='svg-icon' style="transform: rotate(${carAngle}deg);">${CarSVG}</div>`,
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
            const newPoint: [number, number] = [message.x, message.y];
            const newAngle = gpsDirectionAngleCalc(previousPosition, newPoint);

            setPreviousPosition(newPoint);
            setCarPosition(newPoint);
            setCarAngle(newAngle);
        }
    }, [message, previousPosition]);

    return (
        <MapContainer center={position} zoom={13} className="w-full h-full z-10" >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
           {/*<EvtClickMapa onClick={(coords) => console.log("Coordinates:", coords)} /> */}
            <Marker position={carPosition} icon={svgCar} />
        </MapContainer>
    );
}