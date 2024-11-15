package com.taxiapp.api.model;

import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.Ride;

public record RideStatusChangeNotification(String rideId, RideStatus newState, Ride ride) {
}
