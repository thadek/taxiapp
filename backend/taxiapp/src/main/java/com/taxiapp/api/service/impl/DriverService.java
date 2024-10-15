package com.taxiapp.api.service.impl;


import com.taxiapp.api.model.Driver;
import com.taxiapp.api.model.User;
import com.taxiapp.api.repository.DriverRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DriverService {


    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }




    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }
    /**
     * Crea un conductor a partir de un objeto usuario existente. NO HASHEA LA CONTRASEÑA
     * @param user
     * @param licenseid
     * @param is_available
     * @return  Driver
     */
    @Transactional
    public Driver createDriverFromExistingUser(User user, String licenseid, Boolean is_available){
        Driver driver = new Driver();
        driver.setId(user.getId());
        driver.setName(user.getName());
        driver.setLastname(user.getLastname());
        driver.setUsername(user.getUsername());
        driver.setPassword(user.getPassword());
        driver.setEmail(user.getEmail());
        driver.setRoles(user.getRoles());
        driver.setIs_disabled(user.getIs_disabled());
        driver.setLicenseId(licenseid);
        driver.setIsAvailable(is_available);
        return driverRepository.save(driver);
    }

    public Driver getDriver(UUID driverId) {
        return driverRepository.findById(driverId).orElse(null);
    }

    public Iterable<Driver> getDrivers() {
        return driverRepository.findAll();
    }

    public Driver updateDriver(UUID driverId, Driver driver) {
        Driver driverToUpdate = driverRepository.findById(driverId).orElse(null);
        if (driverToUpdate == null) {
            return null;
        }
        driverToUpdate.setLicenseId(driver.getLicenseId());
        driverToUpdate.setRating(driver.getRating());
        driverToUpdate.setIsAvailable(driver.getIsAvailable());
        return driverRepository.save(driverToUpdate);
    }


    public void deleteDriver(UUID driverId) {
        driverRepository.deleteById(driverId);
    }

    public Driver getDriverByLicenseId(String licenseId) {
        return driverRepository.findByLicenseId(licenseId);
    }

    public Iterable<Driver> getAvailableDrivers() {
        return driverRepository.findByIsAvailable(true);
    }



}
