package com.taxiapp.api.controller.rest.user.dto;

import com.taxiapp.api.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.sql.Timestamp;
import java.util.Set;

@Builder
public record UserCreateRequest(
  @NotNull(message = "name cannot be null") String name,
  @NotNull(message = "password cannot be null")  String password,
  @NotNull(message="lastname cannot be null") String lastname,
  @NotNull(message="username cannot be null") String username,
  @NotNull(message = "email cannot be null")String email,
  @NotNull(message="array of roles cannot be null") Set<Role> roles,
        Timestamp is_disabled
,
  @NotNull(message = "phone cannot be null") String phone)
{


}