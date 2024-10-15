package com.taxiapp.api.controller.ride;

import com.taxiapp.api.model.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
