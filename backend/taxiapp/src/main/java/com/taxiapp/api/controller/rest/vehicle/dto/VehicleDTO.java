package com.taxiapp.api.controller.rest.vehicle.dto;

import com.taxiapp.api.controller.rest.driver.dto.DriverDTO;
import com.taxiapp.api.enums.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VehicleDTO {
    Integer id;
    String brand;
    String model;
    String licensePlate;
    String color;
    VehicleStatus status;
    Integer year;
    DriverDTO driver;
}
