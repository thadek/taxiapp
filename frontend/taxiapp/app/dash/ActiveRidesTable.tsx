'use client'
import Link from 'next/link';
import { Ride } from '@/types/ride.type';
import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { loadPlace } from '@/app/utils/loadPlace';
import { Chip, ScrollShadow, Skeleton } from '@nextui-org/react';
import { useEffect } from 'react';
import { toast } from "sonner";
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@nextui-org/react';
import { useState } from 'react'
import { Eye, Search } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatToGMTMinus3 } from '../utils/formatTime';
import LoadingTabSkeleton from '@/components/Dashboard/LoadingTabSkeleton';


const OnGoingRides = ({ webSocketMsg }: { webSocketMsg: any }) => {

    const [searchTerm, setSearchTerm] = useState('')

    const fetchActiveRidesAndPlaces = async () => {
        const session = await getSession();
        if (!session) {
            console.error('No session found');
            return;
        }
        const token = session.token;
        // Fetch rides with status PENDING 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/by-status?states=DRIVER_ASSIGNED,STARTED,ACCEPTED`, {
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

    const filteredRides = rides?.filter(ride =>
        ride.client.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
    )


    useEffect(() => {
        if (!webSocketMsg) return;

        const handleWebSocketMessage = (message: any) => {


            if (message?.eventType === "ACCEPTED_BY_DRIVER" ||
                message?.eventType === "STARTED_BY_DRIVER" ||
                message?.eventType === "COMPLETED_BY_DRIVER" ||
                message?.eventType === "INTERRUPTED_BY_DRIVER" ||
                message?.eventType === "CANCELLED_BY_DRIVER" ||
                message?.eventType === "DRIVER_ASSIGNED_BY_OPERATOR" ||
                message?.eventType === "MODIFIED_BY_OPERATOR" ||
                message?.eventType === "INTERRUPTED_BY_OPERATOR" ||
                message?.eventType === "CANCELLED_BY_OPERATOR" ||
                message?.eventType === "CANCELLED_BY_USER" 

            ) {
                refetch();
            }
        };

        handleWebSocketMessage(webSocketMsg);
    }, [webSocketMsg, refetch]);


    return (

        <div className="w-full h-full col-span-2 bg-gray-950 p-6 rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4">Viajes activos</h2>
            <div className="mb-4">
                <div className="relative">

                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Buscar por teléfono del cliente"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 bg-gray-900 text-white border-gray-800 focus:border-gray-700"
                    />
                </div>
            </div>
            <div className="rounded-md border border-gray-800 overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-gray-900 sticky top-0">
                            <TableRow>
                                <TableHead className="text-gray-400">Teléfono del Cliente</TableHead>
                                <TableHead className="text-gray-400">Origen → Destino</TableHead>
                                <TableHead className="text-gray-400">Conductor</TableHead>
                                <TableHead className="text-gray-400">Vehículo</TableHead>
                                <TableHead className="text-gray-400">Comentarios</TableHead>
                                <TableHead className="text-gray-400">Estado</TableHead>                             
                                <TableHead className="text-gray-400">Hora de creación</TableHead>
                                <TableHead className="text-gray-400 text-right">Detalles</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody >

                            <AnimatePresence>

                                {isPending && (
                                    <LoadingTabSkeleton />
                                )}
                                {isError && (
                                    <tr className="text-gray-500">
                                        <td colSpan={7} className="text-center h-32"> Ocurrió un error al cargar los viajes.</td>
                                       
                                    </tr>
                                )}
                                {isSuccess && rides && filteredRides?.length === 0 && (
                                    <tr className="text-gray-500 " >
                                        <td colSpan={7} className="text-center h-28">No se encontraron viajes activos</td>
                                    </tr>
                                )}

                                {isSuccess && rides && filteredRides?.map((ride: Ride) => (
                                    <motion.tr
                                        key={ride.id}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-gray-800"
                                    >


                                        <TableCell className="text-gray-300 font-medium">{ride.client.phone}</TableCell>
                                        <TableCell className="text-gray-500 text-sm">{ride.originName} → {ride.destinationName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-gray-300">{ride.vehicle?.driver?.name}</span>
                                                <span className="text-gray-500 text-sm">{ride.vehicle?.driver.email}</span>
                                            </div>
                                        </TableCell>
                                        
                                        <TableCell className="text-gray-300">{ride.vehicle?.brand} {ride.vehicle?.model} - {ride.vehicle?.licensePlate} </TableCell>
                                        <TableCell className="text-gray-300">{ride.comments? ride.comments : ""} </TableCell>
                                        <TableCell>
                                            <Chip
                                                variant="flat"
                                                className="text-xs"
                                                color={parseStatus[ride.status as RideStatus].color}
                                            >
                                                {parseStatus[ride.status as RideStatus].detail}
                                            </Chip>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{formatToGMTMinus3(ride.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/rides/${ride.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Ver Detalles
                                                </Button></Link>
                                        </TableCell>
                                     

                                    </motion.tr>

                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    )
}


export default OnGoingRides;