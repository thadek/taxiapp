import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { getSession, signOut } from 'next-auth/react';
import { Spinner } from '@nextui-org/react';
import { useEffect } from 'react';



export default function PendingRidesMiniCard({message}:{message:any}){


    const { data, isLoading,isSuccess, isError,refetch, error } = useQuery({
        queryKey: ['pendingRides'],
        queryFn: async () => {
            const session = await getSession();
            if (!session) {
              console.error('No session found');
              return;
            }
            const token = session.token;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/by-status/PENDING`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
            

              const data = await response.json();
              if(response.status === 401 && data.message === "Expired JWT Token"){  
                signOut();
                return;
              }

              
            
            return data;
        },
    });

    useEffect(() => {
        if(!message) return;
        refetch();

    }, [message])


    if(isLoading) return <Card className="w-full h-full justify-center flex"> <Spinner /> </Card>

    return(
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Viajes pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>

                <div className="text-2xl font-bold">{isSuccess && data.page.totalElements} </div>
                {isError && "Ocurrió un error al obtener datos."}
            </CardContent>
        </Card>
    )
}