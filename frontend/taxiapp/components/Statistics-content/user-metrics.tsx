import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Ride {
  rating?: number;
  report?: boolean;
}

interface PassengerMetricsProps {
  rides: Ride[];
}

export default function PassengerMetrics({ rides }: PassengerMetricsProps) {
  const totalRatings = rides.filter(ride => ride.rating).length
  const averageRating = rides.reduce((sum, ride) => sum + (ride.rating || 0), 0) / totalRatings || 0
  const totalReports = rides.filter(ride => ride.report).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Pasajeros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>Calificación promedio de pasajeros: {averageRating.toFixed(2)}</div>
          <div>Cantidad de reportes creados: {totalReports}</div>
        </div>
      </CardContent>
    </Card>
  )
}

