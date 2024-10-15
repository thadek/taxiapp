package com.taxiapp.api.controller.user.dto;

import com.taxiapp.api.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Builder
public record UserCreateRequest(
  @NotNull(message = "name cannot be null") String name,
  @NotNull(message = "password cannot be null")  String password,
  @NotNull(message="lastname cannot be null") String lastname,
  @NotNull(message="username cannot be null") String username,
  @NotNull(message = "email cannot be null")String email,
  @NotNull(message="array of roles cannot be null") Set<Role> roles,
        Timestamp is_disabled
) {


}