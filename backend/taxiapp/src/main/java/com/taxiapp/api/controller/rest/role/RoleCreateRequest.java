package com.taxiapp.api.controller.rest.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RoleCreateRequest(@NotNull @NotBlank String name) {
}
