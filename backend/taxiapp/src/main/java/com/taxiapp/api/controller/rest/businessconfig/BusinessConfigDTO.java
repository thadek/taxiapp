package com.taxiapp.api.controller.rest.businessconfig;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BusinessConfigDTO {
    @NotBlank @NotNull String id;
    @NotBlank @NotNull String name;
    @NotNull @DecimalMin("0") Double dayTimeKmPrice;
    @NotNull @DecimalMin("0") Double nightTimeKmPrice;
    @NotNull String coords;
}

