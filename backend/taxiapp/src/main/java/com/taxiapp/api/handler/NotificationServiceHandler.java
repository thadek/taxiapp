package com.taxiapp.api.handler;


import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.model.RideNotification;
import com.taxiapp.api.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationServiceHandler {

    private final Logger logger = LoggerFactory.getLogger(NotificationServiceHandler.class);
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
                logger.info("Ride created by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case PROGRAMMED_BY_USER -> {
                //TODO: avisar al operador que el usuario ha programado un viaje
                logger.info("Ride programmed by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case CANCELLED_BY_USER -> {
                //TODO: avisar al operador y al chofer(si corresponde) que el usuario ha cancelado un viaje
                logger.info("Ride cancelled by user");
                //Operador
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                //Chofer (ver)
                if(event.getRide().getVehicle().getDriver() != null){
                    messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                }

            }
            case MODIFIED_BY_USER -> {
                //TODO: avisar al operador y al chofer(si corresponde) que el usuario ha modificado un viaje
                logger.info("Ride modified by user");
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
                logger.info("Ride created by operator");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                messagingTemplate.convertAndSendToUser(event.getRide().getClient().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
            }

            case PROGRAMMED_BY_OPERATOR -> {
                //TODO: avisar al usuario que el viaje ha sido programado
                logger.info("Ride programmed by operator");
            }

            case MODIFIED_BY_OPERATOR -> {
                //TODO: avisar al usuario y al chofer (si corresponde) que el viaje ha sido modificado
                logger.info("Ride modified by operator");
            }

            case DRIVER_ASSIGNED_BY_OPERATOR -> {
                //TODO: avisar al usuario y al chofer que se asigno un chofer al viaje
                logger.info("Driver assigned by operator");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                //Avisar al usuario
                messagingTemplate.convertAndSendToUser(event.getRide().getClient().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
                //Avisar al chofer
                messagingTemplate.convertAndSendToUser(event.getRide().getVehicle().getDriver().getEmail(),"/notification",new RideNotification(event.getEventType(),event.getRide()));
            }

            case INTERRUPTED_BY_OPERATOR -> {
                //TODO: avisar al usuario y chofer (si corresponde) que el viaje ha sido interrumpido
                logger.info("Ride interrupted by operator");
            }

            case CANCELED_BY_OPERATOR -> {
                //TODO: avisar al usuario y chofer (si corresponde) que el viaje ha sido cancelado
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                logger.info("Ride cancelled by operator");

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
                logger.info("Ride accepted by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case STARTED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha iniciado el viaje
                logger.info("Ride started by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case COMPLETED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha completado el viaje
                logger.info("Ride completed by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }

            case INTERRUPTED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha interrumpido el viaje
                logger.info("Ride interrupted by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));

            }

            case CANCELLED_BY_DRIVER -> {
                //TODO: avisar al usuario y al operador que el chofer ha cancelado el viaje
                logger.info("Ride cancelled by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));

            }

        }
    }


}
