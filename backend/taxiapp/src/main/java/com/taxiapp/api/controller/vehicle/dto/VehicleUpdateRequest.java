package com.taxiapp.api.controller.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VehicleUpdateRequest(@NotNull @NotBlank String brand,
                                   @NotNull @NotBlank String model,
                                   @NotNull @NotBlank String color,
                                   @NotNull @NotBlank String details,
                                   @NotNull @NotBlank @Min(1900) Integer year,
                                   @NotNull @NotBlank String licensePlate) {
}
