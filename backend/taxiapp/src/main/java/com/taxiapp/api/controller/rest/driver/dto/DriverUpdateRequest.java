package com.taxiapp.api.controller.rest.driver.dto;

import lombok.Builder;

import java.sql.Timestamp;

@Builder
public record DriverUpdateRequest(
        String licenseId,
        Boolean isAvailable,
        Timestamp is_disabled
){
}