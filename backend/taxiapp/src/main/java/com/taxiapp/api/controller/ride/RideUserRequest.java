package com.taxiapp.api.controller.ride;

import com.taxiapp.api.model.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@RequiredArgsConstructor
@Data
public class RideUserRequest {

    @NotNull
    @NotBlank
    private String pickupLocation;
    @NotNull
    @NotBlank
    private String dropoffLocation;

    private Boolean isBooked;

    private String comments;

    private Date rideStart;





}
