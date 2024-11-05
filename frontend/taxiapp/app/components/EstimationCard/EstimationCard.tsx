import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Divider } from "@nextui-org/react"
import { Label } from "@radix-ui/react-dropdown-menu"



import { MapPinned, MapPin, MapPinCheck, Thermometer, Droplets } from "lucide-react"
import WeatherCard from "../WeatherCard/WeatherCard"



const normalizeKm = (distance: number) => {
    return Math.floor(distance / 1000);
}

const normalizeCost = (distance: number, cost: number) => {
    return Math.floor(distance / 1000 * cost);
}


export default function EstimationCard({ start, end, distance, shift }: { start: any, end: any, distance: number, shift: any }) {

    return (
        <Card className="w-full bg-slate-700 rounded-none ">
            <CardHeader>
                <CardTitle className="gap-3 flex items-center">
                    <MapPinned size={30} />
                    Resultados de estimación
                </CardTitle>
            </CardHeader>
            <Divider />
            <CardContent className="">

                <div className="flex w-full items-center ">

                    <div className="flex flex-col w-1/2">
                        <div className="text-xl  p-2   border-white ">
                            <div className="flex items-center gap-1 ">

                                <MapPin size={15} className="text-red-500" />

                                <hr
                                    style={{
                                        color: 'white',
                                        backgroundColor: 'white',
                                        padding: 0.5,
                                        width: '5%',

                                    }}
                                />
                                <MapPinCheck size={15} className="text-emerald-400" />
                            </div>
                            <Label className="text-xs">Distancia estimada</Label>
                            {normalizeKm(distance)} km
                        </div>


                        <div className="text-xl  p-2   border-white ">
                            <Label className="text-xs">Costo estimado</Label>
                            ${normalizeCost(distance, shift.costoporKm)}
                        </div>
                        <div className="text-xl  p-2   border-white ">
                            <Label className="text-xs">Turno</Label>
                            {shift.name.toUpperCase()}
                        </div>
                    </div>

                    <div className="flex flex-col w-1/2 gap-3 p-3">
                        <WeatherCard text={"Origen"} coords={start[1] + "," + start[0]} />
                        <WeatherCard text={"Destino"} coords={end[1] + "," + end[0]} />
                    </div>


                </div>



            </CardContent>

        </Card>
    )
}




/**
 *  return (  <div className="flex flex-col ">
        <div className="flex flex-col gap-2">
          <span>Distancia: {distance/1000} kilómetros</span>
          <span>Costo estimado: ${distance/1000*shift.costoporKm} (Turno: {shift.name}) </span>
        </div>
        </div>);
 */


