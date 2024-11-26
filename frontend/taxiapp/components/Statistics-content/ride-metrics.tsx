import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Ride {
  status: string;
  cancelledBy?: string;
}

interface TripMetricsProps {
  rides: Ride[];
}

export default function TripMetrics({ rides }: TripMetricsProps) {
  const totalTrips = rides.length
  const acceptedTrips = rides.filter(ride => ride.status === 'ACCEPTED').length
  const cancelledTrips = rides.filter(ride => ride.status === 'CANCELLED').length
  const cancelledByDriver = rides.filter(ride => ride.status === 'CANCELLED' && ride.cancelledBy === 'DRIVER').length
  const cancelledByPassenger = cancelledTrips - cancelledByDriver

  const tripStatusData = [
    { status: 'PENDING', count: rides.filter(ride => ride.status === 'PENDING').length },
    { status: 'PROGRAMMED', count: rides.filter(ride => ride.status === 'PROGRAMMED').length },
    { status: 'DRIVER_ASSIGNED', count: rides.filter(ride => ride.status === 'DRIVER_ASSIGNED').length },
    { status: 'ACCEPTED', count: acceptedTrips },
    { status: 'STARTED', count: rides.filter(ride => ride.status === 'STARTED').length },
    { status: 'COMPLETED', count: rides.filter(ride => ride.status === 'COMPLETED').length },
    { status: 'INCOMPLETED', count: rides.filter(ride => ride.status === 'INCOMPLETED').length },
    { status: 'CANCELLED', count: cancelledTrips },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Total de viajes del día: {totalTrips}</div>
            <div>Viajes aceptados: {acceptedTrips}</div>
            <div>Viajes cancelados: {cancelledTrips}</div>
            <div>- Por conductores: {cancelledByDriver}</div>
            <div>- Por pasajeros: {cancelledByPassenger}</div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Distribución de Estados de Viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tripStatusData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}

