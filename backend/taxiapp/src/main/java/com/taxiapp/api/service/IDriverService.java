package com.taxiapp.api.service;

import com.taxiapp.api.model.Driver;
import com.taxiapp.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IDriverService {

    public Driver createDriver(Driver driver);
    public void createDriverFromExistingUser(UUID userId, String licenseid, Boolean is_available);
    public Driver getDriver(UUID driverId);
    public Page<Driver>getDrivers(Pageable pageable);
}
