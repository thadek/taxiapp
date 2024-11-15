package com.taxiapp.api.handler;


import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationServiceHandler {


    /**
     * Events from user
     * @param event the event
     */
    @Async
    @TransactionalEventListener
    public void handleRideUserEvent(RideStatusChangeEvent event) {

        switch(event.getEventType()){
            case CREATED_BY_USER -> {
                System.out.println("Ride created by user");
                break;
            }

            case PROGRAMMED_BY_USER -> {
                System.out.println("Ride programmed by user");
                break;
            }

            case CANCELLED_BY_USER -> {
                System.out.println("Ride cancelled by user");
                break;
            }

            case MODIFIED_BY_USER -> {
                System.out.println("Ride modified by user");
                break;
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
                System.out.println("Ride created by operator");
            }

            case PROGRAMMED_BY_OPERATOR -> {
                System.out.println("Ride programmed by operator");
            }

            case MODIFIED_BY_OPERATOR -> {
                System.out.println("Ride modified by operator");
            }

            case DRIVER_ASSIGNED_BY_OPERATOR -> {
                System.out.println("Driver assigned by operator");
            }

            case INTERRUPTED_BY_OPERATOR -> {
                System.out.println("Ride interrupted by operator");
            }

            case CANCELED_BY_OPERATOR -> {
                System.out.println("Ride cancelled by operator");
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
                System.out.println("Ride accepted by driver");
            }

            case STARTED_BY_DRIVER -> {
                System.out.println("Ride started by driver");
            }

            case COMPLETED_BY_DRIVER -> {
                System.out.println("Ride completed by driver");
            }

            case INTERRUPTED_BY_DRIVER -> {
                System.out.println("Ride interrupted by driver");
            }

            case CANCELLED_BY_DRIVER -> {
                System.out.println("Ride cancelled by driver");

            }

        }
    }


}
