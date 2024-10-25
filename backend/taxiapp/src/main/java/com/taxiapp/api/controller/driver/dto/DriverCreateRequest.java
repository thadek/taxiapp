package com.taxiapp.api.controller.driver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record DriverCreateRequest(@NotNull UUID userId, @NotBlank @NotNull String licenseId,  @NotNull Boolean isAvailable) {
}