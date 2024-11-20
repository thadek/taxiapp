'use client'
import { useParams } from 'next/navigation'

export default function RideDetails() {

    const { id } = useParams()

  return (
    <div>
      <h1>Detalles del viaje: {id}</h1>
    </div>
  );
}