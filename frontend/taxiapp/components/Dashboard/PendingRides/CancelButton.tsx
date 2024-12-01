'use client'
import { Button } from '@nextui-org/react'
import { X } from 'lucide-react'
import { Dispatch } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { ButtonProps } from '@nextui-org/react'



const CancelRide = ({ rideId, setAssignButtonProps,cancelButtonProps,setCancelButtonProps }: { rideId: string, setAssignButtonProps?: Dispatch<ButtonProps>,cancelButtonProps:ButtonProps,setCancelButtonProps:Dispatch<ButtonProps> }) => {


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
        if(setAssignButtonProps){
        setAssignButtonProps({ ...setAssignButtonProps, isDisabled: true })
        }
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

export default CancelRide;