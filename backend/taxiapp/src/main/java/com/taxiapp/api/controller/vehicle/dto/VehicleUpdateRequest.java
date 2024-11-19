package com.taxiapp.api.controller.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.Date;

@Builder
public record VehicleUpdateRequest(
        String driver_id,
        String brand,
        String model,
        String color,
        String details,
        @Min(1900) Integer year,
        Date isDisabled,
        String licensePlate
) {
}