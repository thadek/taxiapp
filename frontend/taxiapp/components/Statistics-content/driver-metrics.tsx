import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Ride {
  vehicle: {
    driver: {
      id: string;
      name: string;
      lastname: string;
      rating: string;
    };
  };
}

interface DriverMetricsProps {
  rides: Ride[];
}

export default function DriverMetrics({ rides }: DriverMetricsProps) {
  const drivers = rides.reduce((acc: { [key: string]: any }, ride) => {
    const driverId = ride.vehicle.driver.id
    if (!acc[driverId]) {
      acc[driverId] = {
        ...ride.vehicle.driver,
        trips: 0,
        rating: parseFloat(ride.vehicle.driver.rating)
      }
    }
    acc[driverId].trips++
    return acc
  }, {})

  const driverArray = Object.values(drivers)
  const activeDrivers = driverArray.length
  const inactiveDrivers = 0 // Esto debería venir de una consulta separada a la base de datos

  const driverWithMostTrips = driverArray.reduce((max, driver) => max.trips > driver.trips ? max : driver, driverArray[0])
  const driverWithHighestRating = driverArray.reduce((max, driver) => max.rating > driver.rating ? max : driver, driverArray[0])

  const averageTripsPerDriver = driverArray.reduce((sum, driver) => sum + driver.trips, 0) / activeDrivers || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Conductores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>Conductor con más viajes: {driverWithMostTrips.name} {driverWithMostTrips.lastname} ({driverWithMostTrips.trips} viajes)</div>
          <div>Conductor con mayor calificación: {driverWithHighestRating.name} {driverWithHighestRating.lastname} ({driverWithHighestRating.rating})</div>
          <div>Conductores activos: {activeDrivers}</div>
          <div>Conductores inactivos: {inactiveDrivers}</div>
          <div>Viajes promedio por conductor: {averageTripsPerDriver.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

