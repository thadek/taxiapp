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
import { Info } from "lucide-react"



import { MapPinned, MapPin, MapPinCheck, Thermometer, Droplets } from "lucide-react"
import WeatherCard from "../WeatherCard/WeatherCard"



const formatMoney = (amount: number): string => {
    return amount
        .toFixed(2) 
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
        .replace(".", ",") 
}

const normalizeKm = (distance: number) => {
    return Math.floor(distance / 1000);
}

const normalizeCost = (distance: number, cost: number) => {
    return formatMoney(Math.floor(distance / 1000 * cost));
}




export default function EstimationCard({ start, end, distance, shift }: { start: any, end: any, distance: number, shift: any }) {

    return (
        <Card className="w-[20vw] m-3 dark:bg-slate-700  absolute right-0 z-10">
            <CardHeader>
                <CardTitle className="gap-3 flex items-center">
                    <MapPinned size={30} />
                    Resultados de estimación
                </CardTitle>
            </CardHeader>
            <Divider />
            <CardContent className="p-0">

                <div className="flex w-full flex-col p-3">

                    <div className="w-full h-full flex ">
                        <Card className='p-2 w-full dark:bg-slate-800'>
                            
                            <CardContent className="p-2 flex">
                                <div className="text-xs">

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


                                </div>


                            </CardContent>
                        </Card>
                    </div>


                   


                </div>



            </CardContent>

        </Card>
    )
}








