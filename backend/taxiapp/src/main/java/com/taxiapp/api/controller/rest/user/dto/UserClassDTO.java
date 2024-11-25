package com.taxiapp.api.controller.rest.user.dto;

import com.taxiapp.api.entity.Role;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Data
public class UserClassDTO {
    UUID id;
    String name;
    String lastname;
    String username;
    String email;
    String phone;
    Set<Role> roles;
    Timestamp is_disabled;
}
