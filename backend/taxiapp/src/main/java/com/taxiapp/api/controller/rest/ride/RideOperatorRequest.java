package com.taxiapp.api.controller.rest.ride;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.UUID;

@RequiredArgsConstructor
@Data
public class RideOperatorRequest {

    @NotNull
    @NotBlank
    private String pickupLocation;

    @NotNull
    @NotBlank
    private String dropoffLocation;

    private Boolean isBooked;

    @NotNull
    private UUID userId;

    private String comments;

    private Date rideStart;

    private Float price;

    



}
