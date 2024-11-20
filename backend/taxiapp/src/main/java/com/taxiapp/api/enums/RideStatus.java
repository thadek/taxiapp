package com.taxiapp.api.enums;

public enum RideStatus {
    PENDING, /* The ride is pending */
    PROGRAMMED, /* The ride was programmed */
    DRIVER_ASSIGNED, /* The driver was assigned to the ride */
    ACCEPTED, /* The driver accepted the ride */
    STARTED, /* The driver started the ride */
    COMPLETED, /* The driver completed the ride */
    INTERRUPTED, /* The ride was interrupted */
    CANCELLED /* The ride was cancelled */
}
