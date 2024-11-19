package com.taxiapp.api.controller.rest.driver;


import com.taxiapp.api.controller.rest.driver.dto.DriverCreateRequest;
import com.taxiapp.api.controller.rest.driver.dto.DriverDTO;
import com.taxiapp.api.controller.rest.driver.dto.DriverUpdateRequest;
import com.taxiapp.api.model.Driver;
import com.taxiapp.api.service.impl.DriverServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
public class DriverController {


    private final DriverServiceImpl driverService;
    private final ModelMapper modelMapper;

    @PostMapping()
    public ResponseEntity<DriverDTO> createDriver(@RequestBody @Valid DriverCreateRequest driver) {
        Driver driverCreated  = driverService.createDriverFromExistingUser(driver.userId(), driver.licenseId(), driver.isAvailable());
         return ResponseEntity.ok(modelMapper.map(driverCreated, DriverDTO.class));
    }

    /**
     * Update a driver
     * @param driver UserUpdateRequest
     * @return DriverDTO
     */
    @PatchMapping("/{id}")
    public ResponseEntity<DriverDTO> updateDriver(@PathVariable UUID id, @RequestBody @Valid DriverUpdateRequest driver) {
        Driver driverUpdated = driverService.updateDriver(id, driver);
        return ResponseEntity.ok(modelMapper.map(driverUpdated, DriverDTO.class));
    }
    /**
     * Get all Drivers
     * @param pageable Pageable
     * @return PagedModel<DriverDTO>
     */
    @GetMapping()
    public PagedModel<DriverDTO> getDrivers(@PageableDefault() Pageable pageable) {
        Page<Driver> drivers = driverService.getDrivers(pageable);
        return new PagedModel<>(drivers.map(driver -> modelMapper.map(driver, DriverDTO.class)));
    }


    @GetMapping("/{id}")
    public DriverDTO getDriver(@PathVariable UUID id) {
        Driver driver = driverService.getDriver(id);
        return modelMapper.map(driver, DriverDTO.class);
    }


    @GetMapping("/by-license-id/{licenseId}")
    public DriverDTO getDriverByLicenseId(@PathVariable String licenseId) {
        Driver driver = driverService.getDriverByLicenseId(licenseId);
        return modelMapper.map(driver, DriverDTO.class);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable UUID id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

}
