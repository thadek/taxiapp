'use client'

import React, { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { getRides, getRidesByStatus, getDrivers } from '@/app/queries/abm'
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Spinner } from "@nextui-org/spinner"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { TableColumn } from '@nextui-org/react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Chip } from "@nextui-org/chip"
import { Divider } from "@nextui-org/divider"

interface Driver {
  id: string
  name: string
  lastname: string
  rating: number
  isAvailable: boolean
}

interface Vehicle {
  driver: Driver
}

interface Report {
  id: string
  title: string
  description: string
  date: string
}

interface Ride {
  id: string
  status: string
  createdAt: string
  vehicle: Vehicle
  report: Report | null
  rating: number | null
  isBooked: boolean
}

export default function Dashboard() {
  const [totalDrivers, setTotalDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [acceptedRides, setAcceptedRides] = useState<Ride[]>([]);
  const [startedRides, setStartedRides] = useState<Ride[]>([]);
  const [completedRides, setCompletedRides] = useState<Ride[]>([]);
  const [interruptedRides, setInterruptedRides] = useState<Ride[]>([]);
  const [cancelledRides, setCancelledRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
      const token = session.token;
      try {
        const [pending, accepted, started, completed, interrupted, cancelled] = await Promise.all([
          getRidesByStatus(token, "PENDING"),
          getRidesByStatus(token, "ACCEPTED"),
          getRidesByStatus(token, "STARTED"),
          getRidesByStatus(token, "COMPLETED"),
          getRidesByStatus(token, "INTERRUPTED"),
          getRidesByStatus(token, "CANCELLED")
        ]);
        setPendingRides(pending.content);
        setAcceptedRides(accepted.content);
        setStartedRides(started.content);
        setCompletedRides(completed.content);
        setInterruptedRides(interrupted.content);
        setCancelledRides(cancelled.content);
        setRides([...pending.content, ...accepted.content, ...started.content, ...completed.content, ...interrupted.content, ...cancelled.content]);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDrivers = async () => {
      const session = await getSession();
      if (!session) {
        console.error('No session found');
        return;
      }
      const token = session.token;
      try {
        const drivers = await getDrivers(token);
        setTotalDrivers(drivers.content);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    }

    fetchRides();
    fetchDrivers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }


  const totalTrips = rides.length
  const cancelledTrips = rides.filter(ride => ride.status === 'CANCELLED').length


  const drivers = rides.reduce((acc, ride) => {
    if (!ride.vehicle || !ride.vehicle.driver) {
      return acc;
    }
    const driverId = ride.vehicle.driver.id;
    if (!acc[driverId]) {
      acc[driverId] = {
        ...ride.vehicle.driver,
        trips: 0,
        rating: ride.vehicle.driver.rating
      }
    }
    acc[driverId].trips++
    return acc
  }, {} as Record<string, Driver & { trips: number, rating: number }>)

  const driverArray = Object.values(drivers)
  const activeDrivers = totalDrivers.filter(driver => driver.isAvailable);
  const inactiveDrivers = totalDrivers.filter(driver => !driver.isAvailable);
  const driverWithMostTrips = driverArray.reduce((max, driver) => max.trips > driver.trips ? max : driver, { trips: 0, name: '', lastname: '' })
  const driverWithHighestRating = driverArray.reduce((max, driver) => max.rating > driver.rating ? max : driver, { rating: 0, name: '', lastname: '' })
  const averageTripsPerDriver = driverArray.reduce((sum, driver) => sum + driver.trips, 0) / activeDrivers.length || 0


  const totalRatings = rides.filter(ride => ride.rating).length
  const averagePassengerRating = rides.reduce((sum, ride) => sum + (ride.rating || 0), 0) / totalRatings || 0
  const totalReports = rides.filter(ride => ride.report).length


  const rideStatusData = [
    { status: 'Pendientes', count: pendingRides.length },
    { status: 'Programados', count: rides.filter(ride => ride.isBooked).length },
    { status: 'Conductor asignado', count: rides.filter(ride => ride.status === 'DRIVER_ASSIGNED').length },
    { status: 'Aceptados', count: acceptedRides.length },
    { status: 'Iniciados', count: startedRides.length },
    { status: 'Completados', count: completedRides.length },
    { status: 'Interrumpidos', count: interruptedRides.length },
    { status: 'Cancelados', count: cancelledRides.length },
  ]

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <Card className="mb-8 shadow-lg dark:bg-slate-950 border-none">
        <CardBody>
          <h1 className="text-3xl font-bold text-center text-secondary-foreground mb-2">Estadísticas</h1>
          <p className="text-center text-secondary-foreground">Estadísticas en tiempo real de nuestra flota</p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card shadow="sm" className="bg-white dark:bg-slate-950 border-none hover:scale-105 transition-transform duration-200">
          <CardBody className="text-center">
            <p className="text-lg font-semibold text-foreground">Total de viajes</p>
            <p className="text-4xl font-bold text-primary">{totalTrips}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="bg-white dark:bg-slate-950 border-none hover:scale-105 transition-transform duration-200">
          <CardBody className="text-center">
            <p className="text-lg font-semibold text-foreground">Viajes completados</p>
            <p className="text-4xl font-bold text-success">{completedRides.length}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="bg-white dark:bg-slate-950 border-none hover:scale-105 transition-transform duration-200">
          <CardBody className="text-center">
            <p className="text-lg font-semibold text-foreground">Viajes cancelados</p>
            <p className="text-4xl font-bold text-danger">{cancelledTrips}</p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="bg-white dark:bg-slate-950 border-none hover:scale-105 transition-transform duration-200">
          <CardBody className="text-center">
            <p className="text-lg font-semibold text-foreground">Promedio de viajes por conductor</p>
            <p className="text-4xl font-bold text-foreground">{averageTripsPerDriver.toFixed(2)}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card shadow="md" className="bg-white dark:bg-slate-950 border-none">
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <h2 className="text-xl font-bold text-foreground">Métricas de Conductores</h2>
            <Divider className="my-2" />
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <Table aria-label="Métricas de conductores" className="">

              <TableBody className="p-0">
                <TableRow key="most-trips">
                  <TableCell>Conductor con más viajes</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat">
                      {driverWithMostTrips.name} {driverWithMostTrips.lastname} ({driverWithMostTrips.trips} viajes)
                    </Chip>
                  </TableCell>
                </TableRow>
                <TableRow key="highest-rating">
                  <TableCell>Conductor con mayor calificación</TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat">
                      {driverWithHighestRating.name} {driverWithHighestRating.lastname} ({driverWithHighestRating.rating})
                    </Chip>
                  </TableCell>
                </TableRow>
                <TableRow key="active-drivers">
                  <TableCell>Conductores activos</TableCell>
                  <TableCell>
                    <Chip color="secondary" variant="flat">{activeDrivers.length}</Chip>
                  </TableCell>
                </TableRow>
                <TableRow key="inactive-drivers">
                  <TableCell>Conductores inactivos</TableCell>
                  <TableCell>
                    <Chip color="danger" variant="flat">{inactiveDrivers.length}</Chip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card shadow="md" className="border bg-white dark:bg-slate-950 border-none">
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <h2 className="text-xl font-bold text-foreground">Métricas de Pasajeros</h2>
            <Divider className="my-2" />
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <Table aria-label="Métricas de pasajeros">

              <TableBody >
                <TableRow key="avg-rating">
                  <TableCell>Calificación promedio de pasajeros</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat">{averagePassengerRating.toFixed(2)}</Chip>
                  </TableCell>
                </TableRow>
                <TableRow key="total-reports">
                  <TableCell>Cantidad de reportes creados</TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat">{totalReports}</Chip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      <Card shadow="lg" className="mb-8 border bg-white dark:bg-slate-950 border-none">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h2 className="text-xl font-bold text-foreground">Distribución de Estados de Viajes</h2>
          <Divider className="my-2" />
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rideStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Cantidad" fill="#FACC15" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card shadow="lg" className="border bg-white dark:bg-slate-950 border-none">
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          <h2 className="text-xl font-bold text-foreground">Detalles de Conductores</h2>

        </CardHeader>
        <CardBody>
          <Table aria-label="Tabla de conductores" className=" ">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Viajes</TableHead>
                <TableHead>Calificación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {driverArray.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.name} {driver.lastname}</TableCell>
                  <TableCell>{driver.trips}</TableCell>
                  <TableCell>
                    <Chip color="primary" variant="flat">{driver.rating}</Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

