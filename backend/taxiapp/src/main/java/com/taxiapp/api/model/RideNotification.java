package com.taxiapp.api.model;

import com.taxiapp.api.enums.RideEvent;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.Ride;

public record RideNotification(RideEvent eventType, Ride ride) {
}
