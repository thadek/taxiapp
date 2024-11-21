package com.taxiapp.api.entity;

import com.taxiapp.api.enums.RideEvent;

public record RideNotification(RideEvent eventType, Ride ride) {
}
