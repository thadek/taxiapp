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


export default function Dorime() {
    return (
        <Card className="w-full ">
            <CardFooter className="flex-col items-start ">
                <div className="flex w-full h-full">
                    <MapContainer center={[-34.6037, -58.3816]} zoom={13} className="w-full z-10">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </MapContainer>

                    <EstimationCard start={[-58.3816, -34.6037]} end={[-59.3816, -34.6037]} distance={1000} shift={{ name: "diurno", costoporKm: 1000 }} />
<TaxiAppSkeleton />
                </div>
            </CardFooter></Card>

    )
}


