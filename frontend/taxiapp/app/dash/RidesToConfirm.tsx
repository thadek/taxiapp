'use client'
import React, { useEffect, useState } from 'react';


import { getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@nextui-org/react';
import { Ride } from '@/types/ride.type';
import { loadPlace } from '@/app/utils/loadPlace';
import { toast } from "sonner";
import { AnimatePresence } from 'framer-motion';

import { useTheme } from "next-themes";
import PendingRideCard from './PendingRideCard';
import { Logo } from '@/components/ui/logo';
import { CarFront } from 'lucide-react';






const RidesToConfirm = ({ webSocketMsg }: { webSocketMsg: any }) => {



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


      if (message?.eventType === "CREATED_BY_USER"
        || message?.eventType === "UPDATED_BY_USER"
        || message?.eventType === "CANCELLED_BY_USER"
        || message?.eventType === "ACCEPTED_BY_DRIVER"
        || message?.eventType === "CREATED_BY_OPERATOR"
        || message?.eventType === "DRIVER_ASSIGNED_BY_OPERATOR"
        || message?.eventType === "UPDATED_BY_SYSTEM"
        || message?.eventType === "REJECTED_BY_DRIVER") {
        refetch()

      }
    };

    handleWebSocketMessage(webSocketMsg);
  }, [webSocketMsg, refetch]);







  return (

    <Card className="col-span-1  w-full">
      <CardHeader>
        <CardTitle>Viajes pendientes a confirmar</CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex flex-col gap-5 w-full  max-h-[700px] overflow-y-auto   scrollbar-thin scrollbar-thumb-slate-900">
        <AnimatePresence>
          {isPending && (
            <div className="text-gray-500 flex text-center items-center justify-center w-full min-h-96">
              <Spinner />
            </div>
          )}
          {isSuccess && rides && rides.map((trip: Ride) => (
            <PendingRideCard key={trip.id} trip={trip} />
          ))}
          {isSuccess && rides && rides.length === 0 && (
            <div className="text-gray-500 flex text-center items-center flex-col justify-center w-full h-full min-h-5 ">
              <CarFront className="w-14 h-14" />
              No hay viajes pendientes por confirmar.
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>

  );









};










export default RidesToConfirm;