'use client'
import { useParams } from 'next/navigation'
import RideDetail from './rideDetail';

export default function RideDetails() {

    const { id } = useParams()

  return (
    <div>
      <RideDetail rideId={id as string} />
    </div>
  );
}