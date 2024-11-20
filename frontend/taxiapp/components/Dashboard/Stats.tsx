import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Clock, Users } from 'lucide-react';
import { Skeleton } from '@nextui-org/react';
import { CircularProgress } from "@nextui-org/progress";
const Stats = ({ taxisCount, tripsCount, driversCount }) => (
    <div className="grid grid-cols-3 gap-6 mb-6">

        <Card className='relative'>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado del servicio</CardTitle>
                <span className="relative flex h-3 w-3">
                    
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-700"></span>
                </span>

            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">En línea</div>
            </CardContent>

        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Viajes pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>

                <div className="text-2xl font-bold">{tripsCount}</div>
            </CardContent>
        </Card>
       
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Autos en línea</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{driversCount}</div>

            </CardContent>
        </Card>

    </div>
)


export default Stats;