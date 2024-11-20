package com.taxiapp.api.service.impl;


import com.taxiapp.api.controller.rest.driver.dto.DriverCreateRequest;
import com.taxiapp.api.controller.rest.driver.dto.DriverUpdateRequest;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
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

import java.util.List;
import java.util.Set;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements IDriverService {


    private final DriverRepository driverRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;



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
    public Driver createDriverFromExistingUser(UUID userId, String licenseid, Boolean is_available){

        // Buscar el usuario existente
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser == null) {
            throw new EntityNotFoundException("User", "id", userId.toString());
        }

        // Verificar si ya es un driver
        boolean existingDriver = driverRepository.existsById(userId);
        if (existingDriver) {
            throw new DuplicatedEntityException("Driver", "id", userId.toString());
        }

        // Verificar y agregar el rol de DRIVER si no existe
        Role driverRole = roleRepository.findByName("ROLE_DRIVER").orElse(null);
        if (driverRole == null) {
            throw new EntityNotFoundException("Role", "name", "ROLE_DRIVER");
        }
        existingUser.getRoles().add(driverRole);

        // Crear un nuevo Driver y asociarlo al usuario existente
        Driver newDriver = new Driver();
        newDriver.setId(existingUser.getId()); // Usar la misma clave primaria
        newDriver.setLicenseId(licenseid);
        newDriver.setIsAvailable(is_available);

        // Guardar roles
        userRepository.save(existingUser);
        // Guardar el nuevo conductor
        driverRepository.create(userId, licenseid, is_available);

        return driverRepository.findById(userId).orElse(null);
    }


    public Driver getDriver(UUID driverId) {
        return driverRepository.findById(driverId).orElse(null);
    }

    public Page<Driver> getDrivers(Pageable pageable) {
        return driverRepository.findAll(pageable);
    }



    @Transactional
    @Override
    public Driver updateDriver(UUID driverId, DriverUpdateRequest driverUpdateRequest) {
        // Check if the driver exists
        Driver driver = driverRepository.findById(driverId).orElse(null);
        if (driver == null) {
            throw new EntityNotFoundException("Driver", "id", driverId.toString());
        }

        // Set the fields that can be modified
        if (driverUpdateRequest.licenseId() != null) {
            driver.setLicenseId(driverUpdateRequest.licenseId());
        }
        if (driverUpdateRequest.isAvailable() != null) {
            driver.setIsAvailable(driverUpdateRequest.isAvailable());
        }

        return driverRepository.save(driver);
    }


    public void deleteDriver(UUID driverId) {

        Driver driver = driverRepository.findById(driverId).orElse(null);
        if(driver== null){
            throw new EntityNotFoundException("Driver","id",driverId.toString());
        }
       Set<Role> roles =  driver.getRoles();
        for(Role role: roles){
            if(role.getName().equals("ROLE_DRIVER")){
                roles.remove(role);
                break;
            }
        }
        driver.setRoles(roles);
        driverRepository.save(driver);


       driverRepository.deleteById(driverId);


    }

    public Driver getDriverByLicenseId(String licenseId) {
        Driver driver=  driverRepository.findByLicenseId(licenseId).orElse(null);
        if (driver == null) {
            throw new EntityNotFoundException("Driver", "licenseId", licenseId);
        }
        return driver;
    }

    @Transactional
    public Boolean setDriverStatus(UUID driverId, Boolean isAvailable) {
        Driver driver = driverRepository.findById(driverId).orElse(null);
        if (driver == null) {
            throw new EntityNotFoundException("Driver", "id", driverId.toString());
        }
        driver.setIsAvailable(isAvailable);
        driverRepository.save(driver);
        return true;
    }

    @Transactional
    public Driver getDriverByEmail(String email) {
        return driverRepository.findByEmail(email).orElse(null);
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByIsAvailable(true);
    }



}
