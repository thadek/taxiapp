'use client'
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { Ride } from "@/types/ride.type";
import MapWithRoute from "@/components/MapWithRoute/MapWithRoute";
import { parseCoords } from "@/app/utils/parseCoords";
import { parse } from "path";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatToGMTMinus3 } from "@/app/utils/formatTime";
import { Divider } from "@nextui-org/react";
import CancelRide from "@/components/Dashboard/PendingRides/CancelButton";
import { useState } from "react";

export default function RideDetail({ rideId }: { rideId: string }) {

    const [cancelButtonProps, setCancelButtonProps] = useState<ButtonProps>({
        isLoading: false,
        variant: "flat",
        color: "danger",
        disabled: false
    })

    const fetchRide = async () => {
        const session = await getSession();
        if (!session) {
            console.error('No session found');
            return;
        }
        const token = session.token;
        // Fetch rides with status PENDING 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    };

    const { isPending, isSuccess, isError, data: ride, error, refetch } = useQuery<Ride>({
        queryKey: ['ride', rideId],
        queryFn: fetchRide
    })



    const invertCoords = (coords: number[]) => {
        return [coords[1], coords[0]]
    }

    console.log(ride)

    if (isPending) {
        return <div>Cargando...</div>
    }

    return (
        isSuccess && ride &&
        <div className=" bg-slate-700 mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Detalle del Viaje</h1>

            <Card className=" w-full ">

                <CardContent className="p-0 h-96">
                    <MapWithRoute start={invertCoords(parseCoords(ride?.pickup_location))} end={invertCoords(parseCoords(ride?.dropoff_location))} turno={{ name: "diurno", costoporKm: 1000 }} />
                </CardContent>
                <CardHeader>
                    <CardTitle>Información del Viaje</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold">ID del Viaje</h3>
                            <p>{ride.id}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Estado</h3>
                            <Badge variant={ride.status === 'CANCELLED' ? 'destructive' : 'outline'}>
                                {ride.status}
                            </Badge>
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Creación</h3>
                            <p>{formatToGMTMinus3(ride.createdAt)}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Salida</h3>
                            <p>{ride.ride_start ? formatToGMTMinus3(ride.ride_start) : 'No disponible'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Finalización</h3>
                            <p>{ride.ride_end ? formatToGMTMinus3(ride.ride_end) : 'No disponible'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Comentarios</h3>
                            <p>{ride.comments || 'Sin comentarios'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Precio</h3>
                            <p>{ride.price ? `$${ride.price}` : 'No disponible'}</p>
                        </div>

                       


                    </div>
<Divider className="my-5"/>

                    <div className="grid grid-cols-3  gap-4">

                  
                    <div className="grid col-span-1  gap-4">
                    <h3 className="font-semibold mt-6 mb-2">Cliente</h3>
                        <div>
                            <h4 className="font-medium">Nombre</h4>
                            <p>{`${ride.client?.name} ${ride.client?.lastname}`}</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Email</h4>
                            <p>{ride.client?.email}</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Teléfono</h4>
                            <p>{ride.client?.phone}</p>
                        </div>
                    </div>
                    {ride.vehicle?.driver && <div className="grid col-span-1  gap-4">
                        <h3 className="font-semibold mt-6 mb-2">Conductor</h3>
                        
                            <div>
                                <h4 className="font-medium">Nombre</h4>
                                <p>{`${ride.vehicle?.driver.name} ${ride.vehicle?.driver.lastname}`}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Email</h4>
                                <p>{ride.vehicle?.driver.email}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Vehiculo</h4>
                                <p>{ride.vehicle?.brand} - {ride.vehicle?.model} - {ride.vehicle.licensePlate}</p>
                            </div>
                        </div>
                    
                    }


      <CancelRide rideId={ride.id} cancelButtonProps={cancelButtonProps} setCancelButtonProps={setCancelButtonProps} />

                    </div>

                </CardContent>
            </Card>


        </div>
    )
}