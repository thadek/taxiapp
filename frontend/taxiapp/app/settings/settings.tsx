'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
// app/posts/posts.tsx
import { Progress } from '@nextui-org/progress'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'


type AppConfig ={
    name: string
    dayTimeKmPrice: number
    nightTimeKmPrice: number
    coords: string
}

export default function Posts() {
    const { data } = useSuspenseQuery<AppConfig>({ queryKey: ['settings'] })

   

    return (
        <div className="w-full h-[97.1vh]">
            
            <div className="w-full h-[80vh] flex items-center justify-center">
                <Card className='w-2/6'>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex gap-2 items-center"><Info/> Configuración del sistema</CardTitle>
                    </CardHeader>
                    <CardContent>

                        <Label className='text-xs'>Nombre de la Aplicación</Label>
                        <Input type="text" disabled value={data.name} />
                        <Label className='text-xs'>Costo por KM horario Diurno</Label>
                        <Input type="text" disabled value={data.dayTimeKmPrice} />
                        <Label className='text-xs'>Costo por KM horario Nocturno</Label>
                        <Input type="text" disabled value={data.nightTimeKmPrice} />
                        <Label className='text-xs'>Coordenadas de la base</Label>
                        <Input type="text" disabled value={data.coords} />
                        
                    </CardContent>
                   
                </Card>
            </div>

        </div>
    )


}