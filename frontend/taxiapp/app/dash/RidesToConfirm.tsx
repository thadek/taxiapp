'use client'
import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import { getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@nextui-org/react';
import TaxiAppSkeleton from '@/components/taxiapp-skeleton';
import { Ride } from '@/types/ride.type';
import { loadPlace } from '@/app/utils/loadPlace';
import { toast } from "sonner";
import { AnimatePresence, motion } from 'framer-motion';








const RidesToConfirm = ({ webSocketMsg }: { webSocketMsg: any }) => {


  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const fetchRidesAndPlaces = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }
    const token = session.token;
    // Fetch rides with status PENDING 
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/by-status/PENDING`, {
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



  


  const { isPending, isSuccess, isError, data: rides, error, refetch } = useQuery({
    queryKey: ['ridesToConfirm'],
    queryFn: fetchRidesAndPlaces
  })


  useEffect(() => {
    if (!webSocketMsg) return;

    const handleWebSocketMessage = (message: any) => {

        
        if (message?.eventType === "CREATED_BY_USER" || message?.eventType === "UPDATED_BY_USER" || message?.eventType === "CANCELLED_BY_USER") {    
            toast.promise(refetch(), {
                loading: 'Actualizando...',
                success: 'Actualizado',
                error: 'Error al actualizar',
            });       
            
        }
    };

    handleWebSocketMessage(webSocketMsg);
}, [webSocketMsg, refetch]);


  const handleCancel = (ride: Ride) => {
    setSelectedRide(ride);
  };


 


  const confirmCancel = async () => {
    const session = await getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    const token = session.token;

    if (selectedRide) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${selectedRide.id}/operator-cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
        });
        const updatedRide = await response.json();
    
        setSelectedRide(null);
      } catch (error) {
        console.error('Error updating ride status:', error);
      }
    }
  };




  return (

    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Viajes pendientes a confirmar</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
        {isPending && (
          <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
            <TaxiAppSkeleton />
          </div>
        )}
        {isSuccess && rides && rides.map(trip => (
           <motion.div
           key={trip.id}
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 20 }}
           transition={{ duration: 0.3 }}
           
         >
          <div key={trip.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold">{trip.originName} → {trip.destinationName}</div>

            <div className="text-sm text-gray-500">Pasajero: {trip.client.name} - {trip.client.lastname} - {trip.client.phone}</div>
            <div className="text-sm text-gray-500">Comentarios: {trip.comments}</div>
            <div className="text-sm text-gray-500">Fecha: {trip.createdAt}</div>
            <div className="mt-2 flex justify-end space-x-2">
              <Button variant="outline" size="sm" >
                <Check className="mr-2 h-4 w-4" /> Confirmar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => confirmCancel()}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </div>
          </motion.div>
        ))}
        {
          isSuccess && rides && rides.length === 0 && (
            <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
              No hay viajes pendientes por confirmar.
            </div>
          )
        }
        </AnimatePresence>
      </CardContent>
    </Card>
  );









};










export default RidesToConfirm;