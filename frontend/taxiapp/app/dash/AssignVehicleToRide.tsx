'use client'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button
  } from "@nextui-org/react";
import { Ride } from "@/types/ride.type";

import AsyncPickDriverBox from "@/components/AsyncPickDriverBox/AsyncPickDriverBox";
import { Vehicle } from "@/types/vehicle.type";




const ConfirmAssign = ({ride, vehicle,onOpen}:{ride:Ride,vehicle:Vehicle,onOpen:any}) => {


  const {isOpen, onOpenChange,onClose} = useDisclosure();

    const handleConfirm = () => {
      console.log('confirm')
      onClose();
      
    }

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop={"blur"} isKeyboardDismissDisabled={true}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Confirmar asignación</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Viaje</span>
                      <span>{ride.originName} → {ride.destinationName}</span>
                      <span>{ride.client.name} {ride.client.lastname}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">Vehículo</span>
                      <span>{vehicle.brand} {vehicle.model}</span>
                      <span>{vehicle.driver.lastname},{vehicle.driver.name}</span>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                <Button color="success"  variant="flat" onPress={handleConfirm}>
                    Asignar
                  </Button>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                  </Button>
                  
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>

    )
  }

    export default AssignCompontent;