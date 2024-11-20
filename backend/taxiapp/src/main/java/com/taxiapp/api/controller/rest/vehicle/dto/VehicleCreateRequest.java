package com.taxiapp.api.controller.rest.vehicle.dto;


import com.taxiapp.api.enums.VehicleStatus;
import com.taxiapp.api.model.Driver;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;



public record VehicleCreateRequest(
    @NotNull @NotBlank String brand,
    @NotNull @NotBlank String model,
    @NotNull @NotBlank String color,
    @NotNull @NotBlank String details,
    VehicleStatus status,
    @Min(1900) Integer year,
    @NotNull @NotBlank String licensePlate
) {



}
