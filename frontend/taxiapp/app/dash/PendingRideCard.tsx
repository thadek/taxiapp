'use client'
import { Ride } from "@/types/ride.type";
import { Button, ButtonProps } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { formatToGMTMinus3 } from "@/app/utils/formatTime";
import ShineBorder from "@/components/ui/shine-border";
import AsyncPickDriverBox from "@/components/AsyncPickDriverBox/AsyncPickDriverBox";
import { Dispatch, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';






const AssignRideToVehicle = ({ rideId,vehicleId,setCancelButtonProps, assignButtonProps, setAssignButtonProps }: { rideId:string, vehicleId:string|null,setCancelButtonProps:Dispatch<ButtonProps>,assignButtonProps:ButtonProps, setAssignButtonProps:Dispatch<ButtonProps> }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ rideId, vehicleId }: { rideId: string, vehicleId: string }) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}/vehicle/${vehicleId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session?.token}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to assign driver');
            return await response.json();
        },
    });

   

    const handleAssign = () => {
        if (!vehicleId) {
            toast.error('Debe seleccionar un conductor')
            return
        }
        setCancelButtonProps({ ...setCancelButtonProps, isDisabled: true })
        setAssignButtonProps({ ...assignButtonProps, isLoading: true })
        setTimeout(() => {
            mutation.mutate({ rideId: rideId, vehicleId: vehicleId })
            queryClient.refetchQueries({queryKey:['ridesToConfirm']})
        }, 100)
    }

    if(mutation.error){
        return (
            <Button  variant="flat" color="danger" isDisabled>Error al asignar</Button>      
        )
    }
    return (
        <>
        <Button isIconOnly onPress={() => handleAssign()} {...assignButtonProps}><Check className="" /></Button>      
        </>
    );


}


const CancelRide = ({ rideId, setAssignButtonProps,cancelButtonProps,setCancelButtonProps }: { rideId: string, setAssignButtonProps: Dispatch<ButtonProps>,cancelButtonProps:ButtonProps,setCancelButtonProps:Dispatch<ButtonProps> }) => {


    const { data: session } = useSession();
    const queryClient = useQueryClient();

   

    const mutation = useMutation({
        mutationFn: async ({ rideId }: { rideId: string }) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}/operator-cancel`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session?.token}`,
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to cancel ride');
            return await response.json();
        },
    });

    const handleCancel = () => {
        setAssignButtonProps({ ...setAssignButtonProps, isDisabled: true })
        setCancelButtonProps({ ...cancelButtonProps, isLoading: true })
        setTimeout(() => {
            mutation.mutate({ rideId: rideId })
            queryClient.refetchQueries({ queryKey: ['ridesToConfirm'] })
        }, 100)
    }

    if (mutation.error) {
        return (
            <Button variant="flat" color="danger" isDisabled>Error al cancelar</Button>
        )
    }
    return (
        <>
            <Button isIconOnly onPress={() => handleCancel()} {...cancelButtonProps}><X className="" /></Button>
        </>
    );

}


export default function PendingRideCard({ trip }: { trip: Ride }) {

    const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
   
  
    const [validationError, setValidationError] = useState<string | null>(null)
    const [assignButtonProps, setAssignButtonProps] = useState<ButtonProps>({
        isLoading: false,
        variant: "flat",
        color: "success",
        disabled: false
    })

    const [cancelButtonProps, setCancelButtonProps] = useState<ButtonProps>({
        isLoading: false,
        variant: "flat",
        color: "danger",
        disabled: false
    })


    const handleSelectDriver = (key: React.Key | null) => {
        setSelectedDriver(key as string)
        setValidationError(null)
    }


   
    return (
        <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >

            <ShineBorder
                key={trip.id}
                color={["blue", "purple", "pink", "teal", "cyan", "indigo"]}
                borderWidth={1}
                className="w-full  p-0 flex flex-col items-start rounded-lg"
            >
                <div className="bg-slate-900 w-full p-3 rounded-lg">
                    <div className="font-semibold">{trip.originName} → {trip.destinationName}</div>
                    <div className="text-sm text-gray-500">Pasajero: {trip.client.name} - {trip.client.lastname} - {trip.client.phone}</div>
                    <div className="text-sm text-gray-500">Comentarios: {trip.comments}</div>
                    <div className="text-sm text-gray-500">Fecha: {formatToGMTMinus3(trip.createdAt)}</div>
                    <div className="w-full mt-2 flex  gap-1 ">
                        <AsyncPickDriverBox onSelectionChange={handleSelectDriver} validationError={validationError} />

                        <AssignRideToVehicle rideId={trip.id} vehicleId={selectedDriver} assignButtonProps={assignButtonProps} setAssignButtonProps={setAssignButtonProps} setCancelButtonProps={setCancelButtonProps} />
                        
                        <CancelRide rideId={trip.id} cancelButtonProps={cancelButtonProps} setCancelButtonProps={setCancelButtonProps} setAssignButtonProps={setAssignButtonProps} />
                    </div>
                </div>

            </ShineBorder>

        </motion.div>
    );
}