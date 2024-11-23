package com.taxiapp.api.handler;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationServiceHandler {

    private final Logger logger = LoggerFactory.getLogger(NotificationServiceHandler.class);
    private final IUserService userService;

    @Async
    @TransactionalEventListener
    public void handleRideUserEvent(RideStatusChangeEvent event) {
        switch(event.getEventType()){
            case CREATED_BY_USER -> {
                logger.info("Ride created by user");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Created", "A new ride has been created.");
            }
            case PROGRAMMED_BY_USER -> {
                logger.info("Ride programmed by user");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Programmed", "Your ride has been programmed.");
            }
            case CANCELLED_BY_USER -> {
                logger.info("Ride cancelled by user");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
                if(event.getRide().getVehicle().getDriver() != null){
                    sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Cancelled", "A ride has been cancelled.");
                }
            }
            case MODIFIED_BY_USER -> {
                logger.info("Ride modified by user");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Modified", "Your ride has been modified.");
                if(event.getRide().getVehicle().getDriver() != null){
                    sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Modified", "A ride has been modified.");
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
                sendNotification(event.getRide().getClient().getEmail(), "Ride Created", "A new ride has been created.");
            }
            case PROGRAMMED_BY_OPERATOR -> {
                logger.info("Ride programmed by operator");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Programmed", "Your ride has been programmed.");
            }
            case MODIFIED_BY_OPERATOR -> {
                logger.info("Ride modified by operator");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Modified", "Your ride has been modified.");
                if(event.getRide().getVehicle().getDriver() != null){
                    sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Modified", "A ride has been modified.");
                }
            }
            case DRIVER_ASSIGNED_BY_OPERATOR -> {
                logger.info("Driver assigned by operator");
                sendNotification(event.getRide().getClient().getEmail(), "Driver Assigned", "A driver has been assigned to your ride.");
                sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Driver Assigned", "You have been assigned to a ride.");
            }
            case INTERRUPTED_BY_OPERATOR -> {
                logger.info("Ride interrupted by operator");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Interrupted", "Your ride has been interrupted.");
                if(event.getRide().getVehicle().getDriver() != null){
                    sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Interrupted", "A ride has been interrupted.");
                }
            }
            case CANCELED_BY_OPERATOR -> {
                logger.info("Ride cancelled by operator");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
                if(event.getRide().getVehicle().getDriver() != null){
                    sendNotification(event.getRide().getVehicle().getDriver().getEmail(), "Ride Cancelled", "A ride has been cancelled.");
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
                sendNotification(event.getRide().getClient().getEmail(), "Ride Accepted", "Your ride has been accepted by the driver.");
            }
            case STARTED_BY_DRIVER -> {
                logger.info("Ride started by driver");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Started", "Your ride has started.");
            }
            case COMPLETED_BY_DRIVER -> {
                logger.info("Ride completed by driver");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Completed", "Your ride has been completed.");
            }
            case INTERRUPTED_BY_DRIVER -> {
                logger.info("Ride interrupted by driver");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Interrupted", "Your ride has been interrupted.");
            }
            case CANCELLED_BY_DRIVER -> {
                logger.info("Ride cancelled by driver");
                sendNotification(event.getRide().getClient().getEmail(), "Ride Cancelled", "Your ride has been cancelled.");
            }
        }
    }

    private void sendNotification(String userEmail, String title, String body) {
        String userFcmToken = getUserFcmToken(userEmail);

        Message message = Message.builder()
                .setToken(userFcmToken)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            logger.info("Successfully sent message: " + response);
        } catch (Exception e) {
            logger.error("Error sending FCM message", e);
        }
    }

    private String getUserFcmToken(String userEmail) {
        return userService.findByEmail(userEmail).getFcmToken();
    }
}