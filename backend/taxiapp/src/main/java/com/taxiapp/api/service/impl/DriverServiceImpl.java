package com.taxiapp.api.service.impl;


import com.taxiapp.api.controller.driver.dto.DriverCreateRequest;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.model.Driver;
import com.taxiapp.api.model.Role;
import com.taxiapp.api.model.User;
import com.taxiapp.api.repository.DriverRepository;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.service.IDriverService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements IDriverService {


    private final DriverRepository driverRepository;
    private final RoleRepository roleRepository;



    @Transactional
    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }
    /**
     * Crea un conductor a partir de un objeto usuario existente. NO HASHEA LA CONTRASEÑA
     * @param userId
     * @param licenseid
     * @param is_available
     * @return  Driver
     */
    @Transactional
    public void createDriverFromExistingUser(UUID userId, String licenseid, Boolean is_available){

        Driver newDriver = driverRepository.findById(userId).orElse(null);
        if (newDriver == null) {
            throw new EntityNotFoundException("Driver", "id", userId.toString());
        }


        Role driverRole = roleRepository.findByName("ROLE_DRIVER").orElse(null);
        if (driverRole == null) {
            throw new EntityNotFoundException("Role", "name", "ROLE_DRIVER");
        }
        newDriver.getRoles().add(driverRole);
        driverRepository.save(newDriver);

       // driverRepository.create(userId, licenseid, is_available);

    }


    public Driver getDriver(UUID driverId) {
        return driverRepository.findById(driverId).orElse(null);
    }

    public Page<Driver> getDrivers(Pageable pageable) {
        return driverRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Driver updateDriver(UUID driverId, DriverCreateRequest driver) {
        Driver driverToUpdate = driverRepository.findById(driverId).orElse(null);
        if (driverToUpdate == null) {
            throw new EntityNotFoundException("Driver", "id", driverId.toString());
        }
        if(!driverToUpdate.getLicenseId().equals(driver.licenseId())){
            driverToUpdate.setLicenseId(driver.licenseId());
        }

        if(!driverToUpdate.getIsAvailable().equals(driver.isAvailable())){
            driverToUpdate.setIsAvailable(driver.isAvailable());
        }
        return driverRepository.save(driverToUpdate);
    }


    public void deleteDriver(UUID driverId) {

        boolean exists = driverRepository.existsById(driverId);
        if(!exists){
            throw new EntityNotFoundException("Driver","id",driverId.toString());
        }
        driverRepository.deleteById(driverId);

    }

    public Driver getDriverByLicenseId(String licenseId) {
        Driver driver=  driverRepository.findByLicenseId(licenseId).orElse(null);
        if (driver == null) {
            throw new EntityNotFoundException("Driver", "licenseId", licenseId);
        }
        return driver;
    }

    public Iterable<Driver> getAvailableDrivers() {
        return driverRepository.findByIsAvailable(true);
    }



}
