'use client'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { Ride } from "@/types/ride.type";
import MapWithRoute from "@/components/MapWithRoute/MapWithRoute";
import { parseCoords } from "@/app/utils/parseCoords";
import { parse } from "path";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatToGMTMinus3 } from "@/app/utils/formatTime";
import { Divider } from "@nextui-org/react";

import { useState } from "react";
import { Button, ButtonProps, Spinner, Chip } from "@nextui-org/react";
import { X,CheckIcon, Calendar,CarIcon, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import StarSVG from "@/components/star-svg";
import TaxiAppSkeleton from "@/components/taxiapp-skeleton";



const CancelRide = ({ rideId }: { rideId: string }) => {

    const [cancelButtonProps, setCancelButtonProps] = useState<ButtonProps>({ variant: 'flat', color: 'danger', isLoading: false })

    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ rideId }: { rideId: string }) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}/operator-cancel`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session?.token}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to cancel ride');
            return await response.json();
        },
    });

    const handleCancel = () => {
        setCancelButtonProps({ ...cancelButtonProps, isLoading: true })
        setTimeout(() => {
            mutation.mutate({ rideId: rideId })
            window.location.reload()
        }, 100)
    }

    if (mutation.error) {
        return (
            <Button variant="flat" color="danger" isDisabled>Error al cancelar</Button>
        )
    }
    return (
        <>
            <Button onPress={() => handleCancel()} {...cancelButtonProps}><X className="" /> Cancelar viaje</Button>
        </>
    );

}






export default function RideDetail({ rideId }: { rideId: string }) {



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
        queryKey: ['rideDetail', rideId],
        queryFn: fetchRide
    })



    const invertCoords = (coords: number[]) => {
        return [coords[1], coords[0]]
    }

    const handleRating = (rating: number) => {
        //mostrar cantidad de estrellas igual al rating
        return <div className="flex">
            {[...Array(rating)].map((e, i) => <StarSVG key={i} />)}
        </div>
    }

    const handleStatus = (status: string) => {

        type RideStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'PROGRAMMED' | 'DRIVER_ASSIGNED' | 'STARTED' | 'COMPLETED';

        const statusColor = {
            'PENDING': 'warning',
            'ACCEPTED': 'success',
            'CANCELLED': 'danger',
            'PROGRAMMED': 'primary',
            'DRIVER_ASSIGNED': 'primary',
            'STARTED': 'success',
            'COMPLETED': 'success'
        }
    
        type statusColor = 'warning' | 'success' | 'danger' | 'primary';
        const statusText = {
            'PENDING': 'Pendiente',
            'ACCEPTED': 'Aceptado',
            'CANCELLED': 'Cancelado',
            'PROGRAMMED': 'Programado',
            'DRIVER_ASSIGNED': 'Conductor asignado',
            'STARTED': 'En curso',
            'COMPLETED': 'Completado'
        }
    
        const statusIcon = {
            'PENDING': < Spinner color="warning" size="sm"/>,
            'ACCEPTED': <CheckIcon size={'15px'}/>,
            'CANCELLED': <X size={'15px'}/>,
            'PROGRAMMED': <Calendar size={'15px'}/>,
            'DRIVER_ASSIGNED': <CarIcon />,
            'STARTED': < Spinner color="success" size="sm" className="p-3"/>,
            'COMPLETED': <CheckIcon />
        }
    
        return (
            <Chip
                startContent={statusIcon[status as RideStatus]}
                variant="flat"      
                color={statusColor[status as RideStatus] as statusColor}
            >   
                {statusText[status as RideStatus]}
            </Chip>)
    }

    if (isPending) {
        return (
            <div className="text-gray-500 flex flex-col gap-3 text-center items-center justify-center w-full h-screen">          
                <Spinner />
                <p>Se esta cargando el detalle del viaje...</p>
                
            </div>
        )
    }

    if(isError){
        return (
            <div className="text-gray-500 flex flex-col gap-3 text-center items-center justify-center w-full h-screen">                    
                <p>Ocurrió un error al cargar el detalle del viaje. Proba suerte más tarde</p>
                
            </div>
        )
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
                            {handleStatus(ride.status)}
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Creación</h3>
                            <p>{formatToGMTMinus3(ride.createdAt)}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Salida</h3>
                            <p>{ride.ride_start ? formatToGMTMinus3(ride.ride_start) : 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Fecha de Finalización</h3>
                            <p>{ride.ride_end ? formatToGMTMinus3(ride.ride_end) : 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Comentarios</h3>
                            <p>{ride.comments || 'Sin comentarios'}</p>
                        </div>
                        { ride.rating? <div>
                            <h3 className="font-semibold">Calificacion</h3>
                            <p>{handleRating(ride.rating)}</p>
                        </div> : null}
                        <div>
                            <h3 className="font-semibold">Precio</h3>
                            <p>{ride.price ? `$${ride.price}` : 'No disponible'}</p>
                        </div>




                    </div>
                    <Divider className="my-5" />

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

                        {(ride.status === "PENDING" || ride.status === "ACCEPTED" || ride.status === "DRIVER_ASSIGNED")?
                             <CancelRide rideId={ride.id} /> : null}

                    </div>

                </CardContent>
            </Card>


        </div>
    )
}