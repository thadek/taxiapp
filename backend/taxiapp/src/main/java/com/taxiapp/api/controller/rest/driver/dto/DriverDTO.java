package com.taxiapp.api.controller.rest.driver.dto;

import com.taxiapp.api.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DriverDTO {

    UUID id;
    String name;
    String lastname;
    String username;
    String email;
    Timestamp is_disabled;
    String rating;
    String licenseId;
    Boolean isAvailable;

}
