package com.taxiapp.api.service.impl;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.model.Ride;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

   /* public void sendRideStatusChangedNotification(Ride ride, RideStatus status) {
        messagingTemplate.convertAndSend("/topic/rides", ride);
    }*/

   /* public void notifyRideUpdate(RideStatusChangeEvent event) {
        messagingTemplate.convertAndSend("/topic/rides",new EventNotification(event.getRideId(), event.getMessage(), "RideStatusChangeEvent"));
    }*/
}