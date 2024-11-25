'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const rideStatusData = [
  { status: 'PENDING', count: 15 },
  { status: 'PROGRAMMED', count: 30 },
  { status: 'DRIVER_ASSIGNED', count: 20 },
  { status: 'ACCEPTED', count: 25 },
  { status: 'STARTED', count: 40 },
  { status: 'COMPLETED', count: 100 },
  { status: 'INCOMPLETED', count: 5 },
  { status: 'CANCELLED', count: 10 },
]

const recentRides = [
  { id: 1, driver: 'Juan Pérez', passenger: 'María García', status: 'COMPLETED', date: '2023-05-15' },
  { id: 2, driver: 'Ana Rodríguez', passenger: 'Carlos López', status: 'STARTED', date: '2023-05-15' },
  { id: 3, driver: 'Pedro Sánchez', passenger: 'Laura Martínez', status: 'CANCELLED', date: '2023-05-14' },
  { id: 4, driver: 'Sofia Fernández', passenger: 'Diego González', status: 'PENDING', date: '2023-05-14' },
  { id: 5, driver: 'Miguel Torres', passenger: 'Elena Díaz', status: 'PROGRAMMED', date: '2023-05-13' },
]

export default function DashboardContent() {
  const totalRides = rideStatusData.reduce((sum, item) => sum + item.count, 0)
  const completedRides = rideStatusData.find(item => item.status === 'COMPLETED')?.count || 0
  const cancelledRides = rideStatusData.find(item => item.status === 'CANCELLED')?.count || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRides}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viajes Completados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedRides}</div>
          <p className="text-xs text-muted-foreground">
            {((completedRides / totalRides) * 100).toFixed(1)}% del total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viajes Cancelados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledRides}</div>
          <p className="text-xs text-muted-foreground">
            {((cancelledRides / totalRides) * 100).toFixed(1)}% del total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((completedRides / (totalRides - cancelledRides)) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Distribución de Estados de Viajes</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rideStatusData}>
              <XAxis
                dataKey="status"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Viajes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Pasajero</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.id}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>{ride.status}</TableCell>
                  <TableCell>{ride.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

