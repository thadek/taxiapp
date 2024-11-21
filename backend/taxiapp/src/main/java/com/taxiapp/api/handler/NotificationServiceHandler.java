package com.taxiapp.api.handler;


import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.entity.RideNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationServiceHandler {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Events from user
     * @param event the event
     */
    @Async
    @TransactionalEventListener
    public void handleRideUserEvent(RideStatusChangeEvent event) {

        switch(event.getEventType()){
            case CREATED_BY_USER -> {
                //TODO: avisar al operador que el usuario ha creado un viaje
                System.out.println("Ride created by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case PROGRAMMED_BY_USER -> {
                //TODO: avisar al operador que el usuario ha programado un viaje
                System.out.println("Ride programmed by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case CANCELLED_BY_USER -> {
                //TODO: avisar al operador y al chofer(si corresponde) que el usuario ha cancelado un viaje
                System.out.println("Ride cancelled by user");
                //Operador
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                //Chofer
                if(event.getRide().getVehicle().getDriver() != null){
                    messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                }

            }
            case MODIFIED_BY_USER -> {
                //TODO: avisar al operador y al chofer(si corresponde) que el usuario ha modificado un viaje
                System.out.println("Ride modified by user");
                //Operador
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                //Chofer
                if(event.getRide().getVehicle().getDriver() != null){
                    messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                }
            }

        }

    }

    /**
     * Events from driver
     *
     * @param event the event
     */
    @Async
    @TransactionalEventListener
    public void handleRideOperatorEvent(RideStatusChangeEvent event) {

        switch(event.getEventType()){
            case CREATED_BY_OPERATOR -> {
                //TODO: avisar al usuario que el viaje ha sido creado
                System.out.println("Ride created by operator");
                messagingTemplate.convertAndSendToUser(event.getRide().getClient().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
            }

            case PROGRAMMED_BY_OPERATOR -> {
                //TODO: avisar al usuario que el viaje ha sido programado
                System.out.println("Ride programmed by operator");
            }

            case MODIFIED_BY_OPERATOR -> {
                //TODO: avisar al usuario y al chofer (si corresponde) que el viaje ha sido modificado
                System.out.println("Ride modified by operator");
            }

            case DRIVER_ASSIGNED_BY_OPERATOR -> {
                //TODO: avisar al usuario y al chofer que se asigno un chofer al viaje
                System.out.println("Driver assigned by operator");
                //Avisar al usuario
                messagingTemplate.convertAndSendToUser(event.getRide().getClient().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                //Avisar al chofer
                messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
            }

            case INTERRUPTED_BY_OPERATOR -> {
                //TODO: avisar al usuario y chofer (si corresponde) que el viaje ha sido interrumpido
                System.out.println("Ride interrupted by operator");
            }

            case CANCELED_BY_OPERATOR -> {
                //TODO: avisar al usuario y chofer (si corresponde) que el viaje ha sido cancelado
                System.out.println("Ride cancelled by operator");
                //Usuario
                messagingTemplate.convertAndSendToUser(event.getRide().getClient().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));

                //Chofer
                if(event.getRide().getVehicle() != null){

                    messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                }

            }

        }

    }


    /**
     * Events from operator
     * @param event the event
     */
    @Async
    @TransactionalEventListener
    public void handleRideDriverEvent(RideStatusChangeEvent event) {

        switch (event.getEventType()) {
            case ACCEPTED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha aceptado el viaje
                System.out.println("Ride accepted by driver");
            }

            case STARTED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha iniciado el viaje
                System.out.println("Ride started by driver");
            }

            case COMPLETED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha completado el viaje
                System.out.println("Ride completed by driver");
            }

            case INTERRUPTED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha interrumpido el viaje
                System.out.println("Ride interrupted by driver");
            }

            case CANCELLED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha cancelado el viaje
                System.out.println("Ride cancelled by driver");

            }

        }
    }


}
