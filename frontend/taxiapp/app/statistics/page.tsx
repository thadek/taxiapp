'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table"
import { Separator } from '@radix-ui/react-separator';
import { Spinner } from "@nextui-org/spinner";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatisticsContent from '@/components/Statistics-content/statistics-content';
import { getSession } from 'next-auth/react';
import { getRides } from '@/app/queries/abm';

// Definición de tipos
interface Driver {
    id: string
    name: string
    lastname: string
    rating: string
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
  }
  
  export default function StatsPage() {
    const [rides, setRides] = useState<Ride[]>([])
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const fetchRides = async () => {
        const session = await getSession();
        if (!session) {
          console.error('No session found');
          return;
        }
        const token = session.token;
        try {
          const fetchedRides = await getRides(token)
          setRides(fetchedRides.content)
          console.log("Rides fetched:", fetchedRides)
        } catch (error) {
          console.error("Error fetching rides:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchRides()
    }, [])
  
    // Cálculo de estadísticas
    const totalRides = rides.length
    const acceptedRides = rides.filter(ride => ride.status === "ACCEPTED").length
    const cancelledRides = rides.filter(ride => ride.status === "CANCELLED").length
  
    const drivers = rides.reduce((acc, ride) => {
      const driverId = ride.vehicle.driver.id
      if (!acc[driverId]) {
        acc[driverId] = { ...ride.vehicle.driver, rides: 0 }
      }
      acc[driverId].rides++
      return acc
    }, {} as Record<string, Driver & { rides: number }>)
  
    const activeDrivers = Object.values(drivers).filter(driver => driver.rides > 0)
    const inactiveDrivers = Object.values(drivers).filter(driver => driver.rides === 0)
    const averageRidesPerDriver = totalRides / activeDrivers.length || 0
  
    const driverWithMostRides = Object.values(drivers).reduce((a, b) => a.rides > b.rides ? a : b, { rides: 0 } as Driver & { rides: number })
    const driverWithHighestRating = Object.values(drivers).reduce((a, b) => parseFloat(a.rating) > parseFloat(b.rating) ? a : b, { rating: "0" } as Driver)
  
    const averagePassengerRating = rides.reduce((sum, ride) => sum + (ride.rating || 0), 0) / rides.filter(ride => ride.rating).length || 0
  
    const totalReports = rides.filter(ride => ride.report).length
  
    // Datos para el gráfico de estados de viajes
    const rideStatusData = [
      { status: 'PENDING', count: rides.filter(ride => ride.status === 'PENDING').length },
      { status: 'PROGRAMMED', count: rides.filter(ride => ride.status === 'PROGRAMMED').length },
      { status: 'DRIVER_ASSIGNED', count: rides.filter(ride => ride.status === 'DRIVER_ASSIGNED').length },
      { status: 'ACCEPTED', count: rides.filter(ride => ride.status === 'ACCEPTED').length },
      { status: 'STARTED', count: rides.filter(ride => ride.status === 'STARTED').length },
      { status: 'COMPLETED', count: rides.filter(ride => ride.status === 'COMPLETED').length },
      { status: 'INCOMPLETED', count: rides.filter(ride => ride.status === 'INCOMPLETED').length },
      { status: 'CANCELLED', count: rides.filter(ride => ride.status === 'CANCELLED').length },
    ]
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      )
    }
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Estadísticas de Gestión de Taxis</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Total de viajes del día</p>
              <p className="text-3xl font-bold">{totalRides}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Viajes aceptados</p>
              <p className="text-3xl font-bold">{acceptedRides}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Viajes cancelados</p>
              <p className="text-3xl font-bold">{cancelledRides}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Promedio de viajes por conductor</p>
              <p className="text-3xl font-bold">{averageRidesPerDriver.toFixed(2)}</p>
            </CardBody>
          </Card>
        </div>
  
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Distribución de Estados de Viajes</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rideStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Conductor con más viajes</p>
              <p className="text-xl">{driverWithMostRides.name} {driverWithMostRides.lastname}</p>
              <p className="text-sm">Viajes: {driverWithMostRides.rides}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Conductor con mayor calificación</p>
              <p className="text-xl">{driverWithHighestRating.name} {driverWithHighestRating.lastname}</p>
              <p className="text-sm">Calificación: {driverWithHighestRating.rating}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Conductores activos</p>
              <p className="text-3xl font-bold">{activeDrivers.length}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Conductores inactivos</p>
              <p className="text-3xl font-bold">{inactiveDrivers.length}</p>
            </CardBody>
          </Card>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Calificación promedio de pasajeros</p>
              <p className="text-3xl font-bold">{averagePassengerRating.toFixed(2)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-lg font-semibold">Cantidad de reportes creados</p>
              <p className="text-3xl font-bold">{totalReports}</p>
            </CardBody>
          </Card>
        </div>
  
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Detalles de Conductores</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Tabla de conductores">
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Viajes</TableColumn>
                <TableColumn>Calificación</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.values(drivers).map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.name} {driver.lastname}</TableCell>
                    <TableCell>{driver.rides}</TableCell>
                    <TableCell>{driver.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    )
  }
  
  