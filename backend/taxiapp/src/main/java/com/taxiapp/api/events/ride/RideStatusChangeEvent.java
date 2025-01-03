package com.taxiapp.api.events.ride;

import com.taxiapp.api.enums.RideEvent;
import com.taxiapp.api.entity.Ride;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class RideStatusChangeEvent extends ApplicationEvent {
    private final String rideId;
    private final RideEvent eventType;
    private final Ride ride;


    public RideStatusChangeEvent(Object source, String rideId, RideEvent eventType, Ride ride) {
        super(source);
        this.rideId = rideId;
        this.eventType = eventType;
        this.ride = ride;
    }


}