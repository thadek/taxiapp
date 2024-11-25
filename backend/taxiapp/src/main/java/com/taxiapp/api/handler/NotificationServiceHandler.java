package com.taxiapp.api.handler;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.model.RideNotification;
import com.taxiapp.api.service.IUserService;
import com.taxiapp.api.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationServiceHandler {

    private final Logger logger = LoggerFactory.getLogger(NotificationServiceHandler.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationServiceImpl notificationService;

    @Async
    @TransactionalEventListener
    public void handleRideUserEvent(RideStatusChangeEvent event) {
        switch(event.getEventType()){
            case CREATED_BY_USER -> {
                logger.info("Ride created by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Created", "A new ride has been created.");
            }
            case PROGRAMMED_BY_USER -> {
                logger.info("Ride programmed by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Programmed", "Your ride has been programmed.");
            }
            case CANCELLED_BY_USER -> {
                logger.info("Ride cancelled by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
                if(event.getRide().getVehicle() != null){
                    notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Cancelled", "A ride has been cancelled.");
                }
            }
            case MODIFIED_BY_USER -> {
                logger.info("Ride modified by user");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Modified", "Your ride has been modified.");
                if(event.getRide().getVehicle() != null){
                    notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Modified", "A ride has been modified.");
                }
            }
        }
    }

    @Async
    @TransactionalEventListener
    public void handleRideOperatorEvent(RideStatusChangeEvent event) {
        switch(event.getEventType()){
            case CREATED_BY_OPERATOR -> {
                logger.info("Ride created by operator");

                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                



            }
            case PROGRAMMED_BY_OPERATOR -> {
                logger.info("Ride programmed by operator");
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Programmed", "Your ride has been programmed.");
            }
            case MODIFIED_BY_OPERATOR -> {
                logger.info("Ride modified by operator");
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Modified", "Your ride has been modified.");
                if(event.getRide().getVehicle() != null){
                    notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Modified", "A ride has been modified.");
                }
            }
            case DRIVER_ASSIGNED_BY_OPERATOR -> {
                logger.info("Driver assigned by operator");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Driver Assigned", "A driver has been assigned to your ride.");
                notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Driver Assigned", "You have been assigned to a ride.");

            }
            case INTERRUPTED_BY_OPERATOR -> {
                logger.info("Ride interrupted by operator");
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Interrupted", "Your ride has been interrupted.");
                if(event.getRide().getVehicle() != null){
                    notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Interrupted", "A ride has been interrupted.");
                }
            }
            case CANCELLED_BY_OPERATOR -> {

                //TODO: avisar al usuario y chofer (si corresponde) que el viaje ha sido cancelado
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                logger.info("Ride cancelled by operator");
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
                if(event.getRide().getVehicle() != null){
                    notificationService.sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Cancelled", "A ride has been cancelled.");
                }
            }
        }
    }

    @Async
    @TransactionalEventListener
    public void handleRideDriverEvent(RideStatusChangeEvent event) {
        switch (event.getEventType()) {
            case ACCEPTED_BY_DRIVER -> {
                logger.info("Ride accepted by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Accepted", "Your ride has been accepted by the driver.");
            }
            case STARTED_BY_DRIVER -> {
                logger.info("Ride started by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Started", "Your ride has started.");
            }
            case COMPLETED_BY_DRIVER -> {
                logger.info("Ride completed by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Completed", "Your ride has been completed.");
            }
            case INTERRUPTED_BY_DRIVER -> {
                logger.info("Ride interrupted by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Interrupted", "Your ride has been interrupted.");
            }
            case CANCELLED_BY_DRIVER -> {
                logger.info("Ride cancelled by driver");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
                notificationService.sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
            }
        }
    }
    //TODO: este metodo deberia ir en otra clase



    @Async
    @EventListener
    public void handleSystemScheduledEvent(RideStatusChangeEvent event) {
        switch (event.getEventType()) {
            case UPDATED_BY_SYSTEM -> {
                logger.info("Ride updated by system");
                messagingTemplate.convertAndSend("/topic/rides",new RideNotification(event.getEventType(),event.getRide()));
            }
        }
    }

}