package com.taxiapp.api.controller.driver.dto;

import lombok.Builder;

@Builder
public record DriverUpdateRequest(
        String licenseId,
        Boolean isAvailable
){
}