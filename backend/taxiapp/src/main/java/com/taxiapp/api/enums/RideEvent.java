package com.taxiapp.api.enums;

public enum RideEvent {
    CREATED_BY_USER, /* The ride was created by the user */
    PROGRAMMED_BY_USER, /* The ride was programmed by the user */
    CANCELLED_BY_USER, /* The ride was cancelled by the user */
    MODIFIED_BY_USER, /* The ride was modified by the user */

    CREATED_BY_OPERATOR, /* The ride was created by the operator */
    PROGRAMMED_BY_OPERATOR, /* The ride was programmed by the operator */
    DRIVER_ASSIGNED_BY_OPERATOR, /* The driver was assigned by the operator */
    MODIFIED_BY_OPERATOR, /* The ride was modified by the operator */
    INTERRUPTED_BY_OPERATOR, /* The ride was interrupted by the operator */
    CANCELLED_BY_OPERATOR, /* The ride was cancelled by the operator */


    ACCEPTED_BY_DRIVER, /* The ride was accepted by the driver */
    STARTED_BY_DRIVER, /* The ride was started by the driver */
    COMPLETED_BY_DRIVER, /* The ride was completed by the driver */
    INTERRUPTED_BY_DRIVER, /* The ride was interrupted by the driver */
    CANCELLED_BY_DRIVER, /* The ride was cancelled by the driver */


    UPDATED_BY_SYSTEM, /* The ride was updated by the system */


}
