package com.taxiapp.api.controller.user.dto;

import com.taxiapp.api.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Builder
public record UserDTO(
        UUID id,
        String name,
        String lastname,
        String username,
        String email,
        Set<Role> roles,
        Timestamp is_disabled
        ) {


}
