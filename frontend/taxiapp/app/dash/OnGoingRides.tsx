import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Ride } from '@/types/ride.type';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import TaxiAppSkeleton from '@/components/taxiapp-skeleton';
import { loadPlace } from '@/app/utils/loadPlace';
import { Chip } from '@nextui-org/react';
import { useEffect } from 'react';
import { toast } from "sonner";
import { AnimatePresence, motion } from 'framer-motion';

const OnGoingRides = ({ webSocketMsg }: { webSocketMsg: any }) => {


    const fetchActiveRidesAndPlaces = async () => {
        const session = await getSession();
        if (!session) {
            console.error('No session found');
            return;
        }
        const token = session.token;
        // Fetch rides with status PENDING 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/by-status?states=DRIVER_ASSIGNED,STARTED,ACCEPTED&size=6`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const ridesWithPlaces = await Promise.all(data.content.map(async (ride: Ride) => {
            const originName = await loadPlace(ride.pickup_location);
            const destinationName = await loadPlace(ride.dropoff_location);
            return { ...ride, originName, destinationName };
        }));
        return ridesWithPlaces;
    };

    type RideStatus = 'DRIVER_ASSIGNED' | 'ACCEPTED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';

    const parseStatus: Record<RideStatus, { detail: string; color: 'warning' | 'primary' | 'success' | 'danger' }> = {
        DRIVER_ASSIGNED: { detail: 'Conductor asignado', color: 'warning' },
        STARTED: { detail: 'En curso', color: 'primary' },
        ACCEPTED: { detail: 'Aceptado', color: 'success' },
        COMPLETED: { detail: 'Completado', color: 'success' },
        CANCELLED: { detail: 'Cancelado', color: 'danger' },
    }





    const { isPending, isSuccess, isError, data: rides, error, refetch } = useQuery({
        queryKey: ['activeRides'],
        queryFn: fetchActiveRidesAndPlaces,
        staleTime: 0
    })


    useEffect(() => {
        if (!webSocketMsg) return;

        const handleWebSocketMessage = (message: any) => {


            if (message?.eventType === "ACCEPTED_BY_DRIVER" || message?.eventType === "STARTED_BY_DRIVER" || message?.eventType === "COMPLETED_BY_DRIVER" || message?.eventType === "INTERRUPTED_BY_DRIVER") {
                toast.promise(refetch(), {
                    loading: 'Hay cambios en los viajes en curso...',
                    success: 'Actualizado',
                    error: 'Error al actualizar',
                });

            }
        };

        handleWebSocketMessage(webSocketMsg);
    }, [webSocketMsg, refetch]);


    return (

        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Viajes en Curso</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>

                        {isPending && (
                            <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
                                <TaxiAppSkeleton />
                            </div>
                        )}
                        {isSuccess && rides && rides.map((ride: Ride) => (
                            <motion.div
                                key={ride.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}

                            >

                                <div key={ride.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3 flex flex-col">
                                    <div className="text-sm">{ride.originName} → {ride.destinationName}</div>

                                    <div className="text-xs text-gray-500 font-bold">Conductor: {ride.vehicle?.driver?.lastname},{ride.vehicle?.driver?.name} ({ride.vehicle?.driver?.email}) - {ride.vehicle?.brand} {ride.vehicle?.model} </div>

                                    <Chip
                                        variant="flat"
                                        className="text-xs"
                                        color={parseStatus[ride.status as RideStatus].color}

                                    >
                                        {parseStatus[ride.status as RideStatus].detail}
                                    </Chip>

                                    <div className="mt-2 flex justify-end">
                                        <Link href={`/rides/${ride.id}`}>
                                            <Button size="sm" variant="outline">
                                                <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    )
}


export default OnGoingRides;