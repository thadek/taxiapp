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



const RidesToConfirm = () => {

  const [rides, setRides] = useState<Ride[]>([]);

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
    user_id?: string;
    vehicle_id?: number;
  }

  interface User {
    id: string;
    name: string;
    lastname: string;
  }

  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    const fetchRidesAndUsers = async () => {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }

      const token = session.token;

      try {
        // Fetch rides with status PENDING and DRIVER_ASSIGNED
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not an array');
        }
        setRides(data as Ride[]);

        // Fetch user details for each ride
        const userIds = data.map((ride: Ride) => ride.user_id);
        const uniqueUserIds = [...new Set(userIds)];
        const userPromises = uniqueUserIds.map(id => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()));
        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching rides or users:', error);
      }
    };

    fetchRidesAndUsers();
  }, []);

  

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${selectedRide.id}`, {
          method: 'PATCH',
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
    <div>
      {rides.map(ride => (
        <div key={ride.id}>
          <p>{ride.pickup_location}{ride.dropoff_location}</p>
          <p>{ride.user_id && users[ride.user_id] ? `${users[ride.user_id].name} ${users[ride.user_id].lastname}` : 'Unknown User'}</p>
          <Button variant="outline">Confirmar</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" onClick={() => handleCancel(ride)}>Cancelar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto cancelará el viaje.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancel}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default RidesToConfirm;