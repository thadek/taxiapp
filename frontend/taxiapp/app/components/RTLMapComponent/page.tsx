"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import CarSVG from "../carSVG";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MarkerProps {
    lat: number;
    lng: number;
    display_name: string;
}

interface RTLMapComponentProps {
    markers: MarkerProps[];
}

function EvtClickMapa({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click (e) {
            onClick(e.latlng);
        }
    });
    return null;
}

export default function RTLMapComponent() {
    const position = [51.505, -0.09];

    const [carPosition, setCarPosition] = useState<[number, number]>([0, 0]);
    const [previousPosition, setPreviousPosition] = useState<[number, number]>([0, 0]);
    const [carAngle, setCarAngle] = useState(0);

    const svgCar = L.divIcon({
        html:`<div class='svg-icon' style="transform: rotate(${carAngle}deg);">${CarSVG}</div>`,
        className: "car-icon",
    });

    const gpsDirectionAngleCalc = (currentPoint: [number, number], newPoint: [number, number]) => {
        const [lat1, lon1] = currentPoint
        const [lat2, lon2] = newPoint

        const deltaX = lat2 - lat1;
        const deltaY = lon2 - lon1;
        const angle = Math.atan2(deltaY, deltaY) * 180 / Math.PI;
        return angle;
    }

    useEffect(() => {
        const client = new WebSocket("ws://localhost:8080/websocket");
        client.onopen = () => {
            console.log("Connected");
            client.send(JSON.stringify({ subscribe: '/taxi/position' }));
            const newPoint: [number, number] = [0, 0]; // Define newPoint before using it
            setPreviousPosition(newPoint);
        };

        client.onmessage = (message) => {
            const coordinate = JSON.parse(message.data);
            const position = JSON.parse(message.data);
            const newPoint: [number, number] = [position.x, position.y];
            const newAngle = gpsDirectionAngleCalc(previousPosition, newPoint);

            setPreviousPosition(newPoint);
            setCarPosition([coordinate.x, coordinate.y]);
            setCarAngle(newAngle);
        };
        return () => {
            if (client) {
                client.close();
            }
        };
    }, [previousPosition]);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <EvtClickMapa onClick={(c)=>console.log("coordenadas.add(new Coordenada(0, 0));")} />
            <Marker position={carPosition} icon={svgCar} />
                
        </MapContainer>
    )
}
