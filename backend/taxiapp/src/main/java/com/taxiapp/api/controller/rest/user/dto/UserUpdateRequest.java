package com.taxiapp.api.controller.rest.user.dto;

import com.taxiapp.api.entity.Role;
import lombok.Builder;

import java.sql.Timestamp;
import java.util.Set;

@Builder
public record UserUpdateRequest(

        String name,
        String password,
        String lastname,
        String username,
        String email,
        String phone,
        Set<Role> roles,
        Timestamp is_disabled
) {


}