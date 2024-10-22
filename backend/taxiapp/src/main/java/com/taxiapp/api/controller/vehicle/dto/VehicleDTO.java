package com.taxiapp.api.controller.vehicle.dto;

import com.taxiapp.api.controller.driver.dto.DriverDTO;
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
    Integer year;
    DriverDTO driver;
}
