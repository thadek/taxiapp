'use client'
import React, { useState, useEffect } from 'react'
import { Car, Users, Clock, DollarSign, BarChart2, Settings, LogOut, Plus, Check, X, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import Stats from '../../components/Dashboard/Stats'

import RidesToConfirm from './RidesToConfirm';

// Simulated data
const taxisOnline = [
  { id: 1, lat: 40.7128, lng: -74.0060 },
  { id: 2, lat: 40.7282, lng: -73.9942 },
  { id: 3, lat: 40.7589, lng: -73.9851 },
]

const initialPendingTrips = [
  { id: 1, from: 'Coto Neuquen', to: 'ETON', distance: '3.5 km' },
  { id: 2, from: 'Cutralco', to: 'Av. Argentina 200, Neuquen', distance: '100.8 km' },
  { id: 3, from: 'Av. argentina 231, Neuquen', to: 'Belgrano 2400, Neuquén', distance: '3.6 km' },
]

const initialTripsToConfirm = [
  { id: 1, from: 'CEF 1', to: 'Alberdi 23', distance: '2.3km', passenger: 'Juan Alvarez' },
  { id: 2, from: 'Clinica San Agustin', to: 'Parque central', distance: '1.3km', passenger: 'Bob Smith' },
]

const initialOngoingTrips = [
  { id: 1, from: 'Independencia 300, Neuquén', to: 'San Martin 240, Villa Regina', distance: '83.2km', driver: 'Matias', status: 'En ruta' },
  { id: 2, from: 'Antartida Argentina 1111, Neuquén', to: 'Parque Central, Neuquen', distance: '1.2km', driver: 'Jane Smith', status: 'Llegando al destino' },
]

const onlineDrivers = [
  { id: 1, name: 'John Doe', status: 'Available' },
  { id: 2, name: 'Jane Smith', status: 'On Trip' },
  { id: 3, name: 'Mike Johnson', status: 'Available' },
]


  
  // TaxiMap Component (unchanged)
// TaxiMap Component (unchanged)
const TaxiMap = ({ taxis }) => {

    const Map = useMemo(() => dynamic(() => import("@/components/MapWithSearch/page"), { ssr: false }), []);
  
    return (     
          <Map/>   
    )
  }
  
  // New Trip Dialog Component
  const NewTripDialog = ({ onNewTrip }) => {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onNewTrip({ from, to, distance: `${(Math.random() * 10).toFixed(1)} miles` })
      setFrom('')
      setTo('')
    }
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className='bg-gray-800'>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Viaje
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Viaje</DialogTitle>
            <DialogDescription>
              Ingrese los detalles del nuevo viaje a continuación.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="from">Desde</Label>
              <Input id="from" value={from} onChange={(e) => setFrom(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="to">Hasta</Label>
              <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} required />
            </div>
            <Button className='bg-gray-800' type="submit">Crear Viaje</Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  // Updated PendingTrips Component
  const PendingTrips = ({ trips, onNewTrip }) => (
    <Card className="col-span-1 overflow-x-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Viajes pendientes</CardTitle>
        <NewTripDialog onNewTrip={onNewTrip} />
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {trips.map(trip => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="font-semibold">{trip.from} → {trip.to}</div>
              <div className="text-sm text-gray-500">{trip.distance}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
  
  // New TripsToConfirm Component
  const TripsToConfirm = ({ trips, onConfirm, onCancel }) => (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Viajes a Confirmar</CardTitle>
      </CardHeader>
      <CardContent>
        {trips.map(trip => (
          <div key={trip.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold">{trip.from} → {trip.to}</div>
            <div className="text-sm text-gray-500">{trip.distance}</div>
            <div className="text-sm text-gray-500">Pasajero: {trip.passenger}</div>
            <div className="mt-2 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => onConfirm(trip.id)}>
                <Check className="mr-2 h-4 w-4" /> Confirmar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onCancel(trip.id)}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          </div>
        ))}
        {
          trips.length === 0 && (
            <div className="text-gray-500 flex text-center items-center justify-center w-full h-44">
              No hay viajes pendientes por confirmar.
            </div>
          )
        }
      </CardContent>
    </Card>
  )
  
  // New OngoingTrips Component
  const OngoingTrips = ({ trips, onViewDetails }) => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Viajes en Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map(trip => (
            <div key={trip.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="font-semibold">{trip.from} → {trip.to}</div>
              <div className="text-sm text-gray-500">{trip.distance}</div>
              <div className="text-sm text-gray-500">Conductor: {trip.driver}</div>
              <div className="text-sm font-medium mt-1">{trip.status}</div>
              <div className="mt-2 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => onViewDetails(trip.id)}>
                  <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  
  // OnlineDrivers Component (unchanged)
  const OnlineDrivers = ({ drivers }) => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Conductores en línea</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map(driver => (
            <div key={driver.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${driver.id}`} />
                <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{driver.name}</div>
                <div className="text-sm text-gray-500">{driver.status}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )




export default function Dash({ }) {


    

    const [pendingTrips, setPendingTrips] = useState(initialPendingTrips)
    const [tripsToConfirm, setTripsToConfirm] = useState(initialTripsToConfirm)
    const [ongoingTrips, setOngoingTrips] = useState(initialOngoingTrips)

   /* useEffect(() => {
        const interval = setInterval(() => {
            const newTrip = {
                id: Date.now(),
                from: 'New Location',
                to: 'Random Destination',
                distance: `${(Math.random() * 5).toFixed(1)} miles`
            }
            setPendingTrips(prevTrips => [newTrip, ...prevTrips.slice(0, 2)])
        }, 1000)

        return () => clearInterval(interval)
    }, []) */

    const handleNewTrip = (trip) => {
        setPendingTrips(prevTrips => [{ id: Date.now(), ...trip }, ...prevTrips])
    }

    const handleConfirmTrip = (id) => {
        setTripsToConfirm(prevTrips => prevTrips.filter(trip => trip.id !== id))
        // Here you would typically assign a driver and move the trip to ongoing trips
        setOngoingTrips(prevTrips => [{ id, from: 'Confirmed Trip', to: 'Destination', distance: '5 miles', driver: 'Assigned Driver', status: 'En ruta' }, ...prevTrips])
    }

    const handleCancelTrip = (id) => {
        setTripsToConfirm(prevTrips => prevTrips.filter(trip => trip.id !== id))
    }

    const handleViewTripDetails = (id) => {
        // Here you would typically open a modal or navigate to a details page
        console.log(`Viewing details for trip ${id}`)
    }





    return (
        <div className="flex-1 p-8 overflow-auto">
            <Stats
                taxisCount={taxisOnline.length}
                tripsCount={pendingTrips.length}
                driversCount={onlineDrivers.length}
            />
            <div className="grid grid-cols-2 gap-6">
                <TaxiMap taxis={taxisOnline} />
                <PendingTrips trips={pendingTrips} onNewTrip={handleNewTrip} />
                <TripsToConfirm
                    trips={tripsToConfirm}
                    onConfirm={handleConfirmTrip}
                    onCancel={handleCancelTrip}
                />
                <OngoingTrips
                    trips={ongoingTrips}
                    onViewDetails={handleViewTripDetails}
                />
                <OnlineDrivers drivers={onlineDrivers} />
            </div>
            <div className="col-span-2">
              <RidesToConfirm />
            </div>
        </div>
    )
}