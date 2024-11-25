import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { Spinner } from '@nextui-org/react';


export default function ScheduledRidesMiniCard(){


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['programmedRides'],
        queryFn: async () => {
            const session = await getSession();
            if (!session) {
              console.error('No session found');
              return;
            }
            const token = session.token;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/by-status/PROGRAMMED`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
            const data = await response.json();
            return data;
        },
    });


    if(isLoading) return <Card className="w-full h-full justify-center flex"> <Spinner /> </Card>

    return(
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Viajes programados</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.page.totalElements}</div>

            </CardContent>
        </Card>

    )
}