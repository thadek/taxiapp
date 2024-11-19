package com.taxiapp.api.controller.rest.driver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record DriverCreateRequest(@NotNull UUID userId, @NotNull String licenseId,  @NotNull Boolean isAvailable) {
}
