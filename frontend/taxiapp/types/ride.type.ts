import { User } from './user.type';
import { Vehicle } from './vehicle.type';

export type Ride = {
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
    status: string;
    updated_at: string;
    vehicle: Vehicle |null
    client: User
    originName: string
    destinationName: string
  }
  
  
