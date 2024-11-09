'use client'
import EstimationCard from "../components/EstimationCard/EstimationCard"
import { MapContainer } from "react-leaflet"
import { TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Card } from "@/components/ui/card"
import { CardFooter } from "@/components/ui/card"
import TaxiAppSkeleton from "@/components/taxiapp-skeleton";
import RealTimeStatus from "../components/WebSocketStatus/WebSocketStatus";
import RTLMapComponent from "../components/RTLMapComponent/page";


export default function Dorime() {
    return (

        
        <RTLMapComponent />
    )
}


