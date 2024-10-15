package com.taxiapp.api.controller.role;

import jakarta.validation.constraints.NotNull;

public record RoleCreateRequest(@NotNull String name) {
}
