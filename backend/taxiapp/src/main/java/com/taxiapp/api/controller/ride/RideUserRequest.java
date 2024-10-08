package com.taxiapp.api.controller.ride;

import com.taxiapp.api.model.entity.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

public class RideUserRequest {

    @NotNull
    @NotBlank
    private String pickup_location;
    @NotNull
    @NotBlank
    private String dropoff_location;
    @NotNull
    @NotBlank
    private Boolean is_booked;
    @Valid
    private User client;

}
