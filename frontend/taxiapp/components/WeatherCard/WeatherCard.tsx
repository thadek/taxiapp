'use client'
import { useQuery } from '@tanstack/react-query'
import { getWeather } from '@/app/queries/weather'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'

import { Info } from 'lucide-react'
import { Divider } from '@nextui-org/react'

import { Spinner } from '@nextui-org/react';
import Image from 'next/image'
import { Logo } from '@/components/ui/logo'



export default function WeatherCard({ coords, text }: { coords: string, text: string }) {

    const { data, isLoading, isError, isSuccess, status } = useQuery({ queryKey: ['weather', coords], queryFn: async () => getWeather(coords) })


    if (isLoading) {
        return (<div className="w-full h-[20vh] flex justify-center items-center">
            
            <Spinner />
        </div>)
    }

    if (isError) {
        return <div>Error</div>
    }

    if(isSuccess && data.error){
        return <div>Error al obtener la información.</div>
    }

    return (
        isSuccess && 


        <div className="w-full h-full pt-1  flex items-center justify-center max-h-[500px]">
            <Card className='w-full p-2 dark:bg-slate-800'>
                <CardHeader className="p-2">
                    <CardTitle className="text-sm font-bold flex gap-2 items-center">
                        <Info size={15} /> Clima en {text}
                    </CardTitle>
                </CardHeader>
                <Divider />
                <CardContent className="p-2 flex ">

                    <div className="flex w-2/6">
                    <Image src={`https:${data.current.condition.icon}`}  alt={"weather-icon"} width={100} height={100} />
                    </div>
                    <div className="flex w-4/6">  <div className="text-xs">
                        <p>{data.location.name}, {data.location.region}</p>
                        <p>Temperatura: {data.current.temp_c}°C</p>
                        <p>Condición: {data.current.condition.text}</p>
                        <p>Humedad: {data.current.humidity}%</p>
                        <p>Viento: {data.current.wind_kph} km/h</p>
                    </div></div>


                </CardContent>
            </Card>
        </div>


    )

}