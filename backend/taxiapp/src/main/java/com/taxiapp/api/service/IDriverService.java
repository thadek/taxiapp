package com.taxiapp.api.service;

import com.taxiapp.api.controller.rest.driver.dto.DriverCreateRequest;
import com.taxiapp.api.controller.rest.driver.dto.DriverUpdateRequest;
import com.taxiapp.api.model.Driver;
import com.taxiapp.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface IDriverService {

    public Driver createDriver(Driver driver);
    public Driver createDriverFromExistingUser(UUID userId, String licenseid, Boolean is_available);
    public Driver getDriver(UUID driverId);
    public Page<Driver>getDrivers(Pageable pageable);

    @Transactional
    Driver updateDriver(UUID driverId, DriverUpdateRequest driver);
}
