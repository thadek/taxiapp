package com.taxiapp.api.handler;

import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class RideStatusChangeListener {

    //private final NotificationServiceImpl notificationService;

    @TransactionalEventListener
    public void handleRideStatusChangeEvent(RideStatusChangeEvent event) {
        //Chequeo tipo de cambio de estado



    }
}
