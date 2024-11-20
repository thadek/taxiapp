'use client'
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@nextui-org/react';





interface Ride {
  id: string;
  comments?: string;
  created_at: string;
  dropoff_location: string;
  is_booked: boolean;
  pickup_location: string;
  price?: number;
  rating?: number;
  ride_end?: string;
  ride_start?: string;
  status: number;
  updated_at: string;
  vehicle: null
  client: User
  originName: string
  destinationName: string
}


type User = {
  id: string
  name: string
  lastname: string
  username: string
  email: string
  phone: string
  is_disabled: boolean
  deleted: boolean

}



const RidesToConfirm = ({reload}:{reload:any}) => {


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



  const { isPending, isSuccess, isError, data:rides, error } = useQuery({
    queryKey: ['ridesToConfirm',reload],
    queryFn: fetchRidesAndPlaces
  })



  const handleCancel = (ride: Ride) => {
    setSelectedRide(ride);
  };


  const loadPlace = async (coords: string) => {
    const [lat, lon] = coords.split(',');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      return data.address ? `${data.address.road} ${data.address.house_number}, ${data.address.city} (Estimado)` : 'Ubicación no geo-referenciada';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Error obteniendo dirección';
    }
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
        setRides(rides.filter(ride => ride.id !== selectedRide.id));
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
        {isPending && (
          <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
           <Spinner />
          </div>
        )}	
        {isSuccess && rides && rides.map(trip => (
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
        ))}
        {
         isSuccess && rides &&  rides.length === 0 && (
            <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
              No hay viajes pendientes por confirmar.
            </div>
          )
        }
      </CardContent>
    </Card>
  );









};










export default RidesToConfirm;