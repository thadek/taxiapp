import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import Link from 'next/link';

// New OngoingTrips Component
const OngoingTrips = ({ trips }:{trips:any}) => (
    <Card className="col-span-2">
        <CardHeader>
            <CardTitle>Viajes en Curso</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map((trip:any) => (
                    <div key={trip.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-semibold">{trip.from} → {trip.to}</div>
                        <div className="text-sm text-gray-500">{trip.distance}</div>
                        <div className="text-sm text-gray-500">Conductor: {trip.driver}</div>
                        <div className="text-sm font-medium mt-1">{trip.status}</div>
                        <div className="mt-2 flex justify-end">
                            <Link href={`/rides/${trip.id}`}>
                                <Button size="sm" variant="outline">
                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)


export default OngoingTrips;