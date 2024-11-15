package com.taxiapp.api.controller.rest.vehicle;

import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleCreateRequest;
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



    /**
     * Get all Vehicles
     * @param pageable Pageable
     * @return PagedModel<Vehicle>
     */
    @GetMapping
    public PagedModel<VehicleDTO> getAllVehicles(
            @PageableDefault() Pageable pageable,
            @RequestParam(required = false, value = "deleted") boolean deleted
    ) {
        Page<Vehicle> vehicles;
        if(deleted){
            vehicles = vehicleServiceImpl.findAllDeleted(pageable);
        }else{
            vehicles = vehicleServiceImpl.findAll(pageable);
        }
        return new PagedModel<>(vehicles.map(vehicle -> modelMapper.map(vehicle, VehicleDTO.class)));

    }


    /**
     * Create a new Vehicle
     * @param vehicle VehicleCreateRequest
     * @return ResponseEntity<Vehicle>
     */
    @PostMapping()
    public ResponseEntity<Vehicle> createVehicle(@RequestBody @Valid VehicleCreateRequest vehicle) {
        return new ResponseEntity<>(vehicleServiceImpl.create(vehicle), HttpStatus.CREATED);
    }


    /**
     * Get Vehicle by Id
     * @param id String
     * @return ResponseEntity<VehicleDTO>
     */
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable String id) {
        Vehicle vehicle = vehicleServiceImpl.findById(id);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }


    /**
     * Update Vehicle
     * @param vehicle VehicleUpdateRequest
     * @param id String
     * @return ResponseEntity<VehicleDTO>
     */
    @PatchMapping ("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@RequestBody @Valid VehicleUpdateRequest vehicle, @PathVariable String id) {
        Vehicle updatedVehicle = vehicleServiceImpl.update(vehicle, id);
        return new ResponseEntity<>(modelMapper.map(updatedVehicle, VehicleDTO.class), HttpStatus.OK);
    }

    /**
     * Delete Vehicle
     * @param id String
     * @return ResponseEntity<Void>
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable String id) {
        vehicleServiceImpl.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    /**
     * Assign a driver to a vehicle
     * @param vehicleId String vehicleId
     * @param driverId UUID driverId
     * @return ResponseEntity<VehicleDTO>
     */
    @PatchMapping("/{vehicleId}/driver/{driverId}")
    public ResponseEntity<VehicleDTO> setDriver(@PathVariable String vehicleId, @PathVariable UUID driverId) {
        Vehicle vehicle = vehicleServiceImpl.setDriver(vehicleId, driverId);
        return new ResponseEntity<>(modelMapper.map(vehicle, VehicleDTO.class), HttpStatus.OK);
    }


    /**
     * Restore a deleted vehicle
     * @param id String
     * @return ResponseEntity<ResultResponse>
     */
    @PatchMapping("/{id}/restore")
    public ResponseEntity<ResultResponse> restoreVehicle(@PathVariable String id) {
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



}
