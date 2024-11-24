package com.taxiapp.api.model;

import com.taxiapp.api.entity.Ride;
import com.taxiapp.api.enums.RideEvent;

public record RideNotification(RideEvent eventType, Ride ride) {
}
