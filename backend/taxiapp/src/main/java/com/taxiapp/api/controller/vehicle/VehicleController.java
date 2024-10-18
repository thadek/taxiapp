package com.taxiapp.api.controller.vehicle;

import com.taxiapp.api.controller.user.dto.UserDTO;
import com.taxiapp.api.controller.user.mapper.UserMapper;
import com.taxiapp.api.controller.vehicle.dto.VehicleCreateRequest;
import com.taxiapp.api.controller.vehicle.dto.VehicleDTO;
import com.taxiapp.api.controller.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.model.User;
import com.taxiapp.api.model.Vehicle;
import com.taxiapp.api.service.impl.VehicleServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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


}
