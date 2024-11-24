'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Spinner } from '@nextui-org/react'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { formatToGMTMinus3 } from '@/app/utils/formatTime'
import { Ride } from '@/types/ride.type'

type Role = {
    name: string
    id: number
}

type User = {
    id: string
    name: string
    lastname: string
    username: string
    email: string
    phone: string
    is_disabled: boolean | null
    deleted: boolean
    roles: Role[]
}





const fetchTrips = async (page = 0, searchTerm = '') => {

    const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/rides' + `?page=${page}&size=18&sort=createdAt,desc`
    const session = await getSession();
    const rides = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.token}` // Add your token here
        }
    })

    const allTrips = await rides.json()

    return {
        trips: allTrips.content,
        page: allTrips.page
    }
}

export default function RidesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['trips', page, searchTerm],
        queryFn: () => fetchTrips(page, searchTerm)
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(0) // Reset to first page on new search
    }

    if (isLoading) return <Card className="w-full h-full justify-center flex"> <Spinner /> </Card>
    if (isError) return <Card className="w-full h-full justify-center flex"> Ocurrió un error al cargar los viajes. </Card>

    return (
        <div className="p-3 flex justify-center  items-center ">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Rides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Buscar viajes..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Creado</TableHead>
                                    <TableHead>Inicio</TableHead>
                                    <TableHead>Fin</TableHead>
                                    <TableHead>Origen</TableHead>
                                    <TableHead>Destino</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Conductor</TableHead>
                                    <TableHead>Cliente</TableHead>

                                    <TableHead>Detalles</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.trips.map(({trip}:{trip:Ride}) => (
                                    <TableRow key={trip.id}>
                                        <TableCell className="font-medium">{trip.id.slice(0, 8)}...</TableCell>
                                        <TableCell>{formatToGMTMinus3(trip.createdAt)}</TableCell>
                                        <TableCell>{formatToGMTMinus3(trip.ride_start)}</TableCell>
                                        <TableCell>{formatToGMTMinus3(trip.ride_end)}</TableCell>
                                        <TableCell>{trip.pickup_location}</TableCell>
                                        <TableCell>{trip.dropoff_location}</TableCell>
                                        <TableCell>{trip.status}</TableCell>
                                        <TableCell>{`${trip.vehicle && trip.vehicle.driver.name} ${trip.vehicle && trip.vehicle.driver.lastname}`}</TableCell>
                                        <TableCell>{`${trip.client.name} ${trip.client.lastname}`}</TableCell>
                                        <TableCell>
                                            <Link href={`/rides/${trip.id}`}>
                                                <Button size="sm" variant="outline" >
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {data?.trips.length === 0 && (
                        <p className="text-center mt-4 text-gray-500">No trips found matching your search.</p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            onClick={() => setPage(old => Math.max(old - 1, 0))}
                            disabled={page === 0}
                            variant={page === 0 ? 'secondary' : 'outline'}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <span>Pagina {data?.page.number} de {data?.page.totalPages}</span>
                        <Button
                            onClick={() => setPage(old => (data?.page.totalPages && old < data.page.totalPages ? old + 1 : old))}
                            disabled={data?.page.number === data?.page.totalPages}
                            variant={data?.page.number === data?.page.number ? 'secondary' : 'outline'}
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card></div>
    )
}