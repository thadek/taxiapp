import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const parseStatus = (status:string) => {

    type statusTypes = "CONNECTED" | "DISCONNECTED" | "RECONNECTING"

    const statusTypes = {
        'CONNECTED': 'En línea',
        'DISCONNECTED': 'Desconectado',
        'RECONNECTING': 'Reconectando',
    }
    return statusTypes[status as statusTypes]
}


const statusColor = (status:string) => {
    
        type statusTypes = "CONNECTED" | "DISCONNECTED" | "RECONNECTING"
    
        const statusTypes = {
            'CONNECTED': 'bg-green-500',
            'DISCONNECTED': 'bg-red-500',
            'RECONNECTING': 'bg-yellow-500',
            'FAILED': 'bg-red-500'
        }
        return statusTypes[status as statusTypes]
    }

export default function ServiceStatus({status}:{status:string}) {

    



    return(<Card className='relative'>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del servicio</CardTitle>
            <span className="relative flex h-3 w-3">
                
                <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColor(status)}`}></span>
            </span>

        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{parseStatus(status)}</div>
        </CardContent>

    </Card>)
}