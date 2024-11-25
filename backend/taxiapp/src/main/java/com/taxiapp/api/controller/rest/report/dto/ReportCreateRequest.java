package com.taxiapp.api.controller.rest.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.UUID;

public record ReportCreateRequest(
        @NotNull @NotBlank String title,
        @NotNull @NotBlank String description,
        @NotNull @NotBlank String lastLocation,
        @NotNull @NotBlank String rideId,
        @NotNull Date date
) {
}
