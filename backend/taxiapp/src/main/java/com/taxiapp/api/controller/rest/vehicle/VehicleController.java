package com.taxiapp.api.controller.rest.vehicle;

import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleCreateRequest;
import com.taxiapp.api.enums.VehicleStatus;
import com.taxiapp.api.model.Vehicle;
import com.taxiapp.api.service.impl.VehicleServiceImpl;
import com.taxiapp.api.utils.ResultResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_OPERATOR')")
public class VehicleController {

    private final VehicleServiceImpl vehicleServiceImpl;
    private final ModelMapper modelMapper;

    @GetMapping
    public PagedModel<VehicleDTO> getAllVehicles(
            @PageableDefault() Pageable pageable,
            @RequestParam(required = false, value = "deleted") boolean deleted
    ) {
        Page<Vehicle> vehicles;
        if (deleted) {
            vehicles = vehicleServiceImpl.findAllDeleted(pageable);
        } else {
            vehicles = vehicleServiceImpl.findAll(pageable);
        }
        return new PagedModel<>(vehicles.map(vehicle -> modelMapper.map(vehicle, VehicleDTO.class)));
    }

    @PostMapping()
    public ResponseEntity<Vehicle> createVehicle(@RequestBody @Valid VehicleCreateRequest vehicle) {
        return new ResponseEntity<>(vehicleServiceImpl.create(vehicle), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Integer id) {
        Vehicle vehicle = vehicleServiceImpl.findById(id);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@RequestBody @Valid VehicleUpdateRequest vehicle, @PathVariable Integer id) {
        Vehicle updatedVehicle = vehicleServiceImpl.update(vehicle, id);
        return new ResponseEntity<>(modelMapper.map(updatedVehicle, VehicleDTO.class), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Integer id) {
        System.out.println("Deleting vehicle with id: " + id + "Type: " + id.getClass());
        vehicleServiceImpl.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{vehicleId}/driver/{driverId}")
    public ResponseEntity<VehicleDTO> setDriver(@PathVariable Integer vehicleId, @PathVariable UUID driverId) {
        Vehicle vehicle = vehicleServiceImpl.setDriver(vehicleId, driverId);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ResultResponse> restoreVehicle(@PathVariable Integer id) {
        return new ResponseEntity<>(vehicleServiceImpl.restore(id), HttpStatus.OK);
    }


    /**
     * Find Vehicle by driver id
     */
    @GetMapping("/find-by-driver/{driverId}")
    public ResponseEntity<VehicleDTO> findByDriverId(@Valid @PathVariable UUID driverId) {
        Vehicle vehicle = vehicleServiceImpl.findByDriverId(driverId);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }


    /**
     * Find Vehicle by driver email
     */
    @GetMapping("/find-by-driver-email/{driverEmail}")
    public ResponseEntity<VehicleDTO> findByDriverId( @PathVariable String driverEmail) {
        Vehicle vehicle = vehicleServiceImpl.findByDriverEmail(driverEmail);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<VehicleDTO> changeStatus(@PathVariable Integer id, @PathVariable VehicleStatus status) {
        Vehicle vehicle = vehicleServiceImpl.updateStatusByOperator(id, status);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }


}