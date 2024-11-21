package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.rest.vehicle.dto.VehicleCreateRequest;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.enums.VehicleStatus;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.exception.vehicle.VehicleException;
import com.taxiapp.api.entity.Driver;
import com.taxiapp.api.entity.Vehicle;
import com.taxiapp.api.repository.DriverRepository;
import com.taxiapp.api.repository.VehicleRepository;
import com.taxiapp.api.service.IVehicleService;
import com.taxiapp.api.utils.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements IVehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;


    @Transactional
    @Override
    public Vehicle create(VehicleCreateRequest vehicle) {
        boolean exists = vehicleRepository.existsByLicensePlate(vehicle.licensePlate());
        if(exists){
            throw new DuplicatedEntityException("Vehicle","licence plate",vehicle.licensePlate());
        }

       Vehicle newVehicle = Vehicle.builder()
                .licensePlate(vehicle.licensePlate())
                .brand(vehicle.brand())
                .model(vehicle.model())
                .year(vehicle.year())
                .color(vehicle.color())
                .details(vehicle.details())
                .build();

        if(vehicle.status() == null) {
            newVehicle.setStatus(VehicleStatus.AVAILABLE);
        } else {
            newVehicle.setStatus(vehicle.status());
        }

        return vehicleRepository.save(newVehicle);

    }

    @Transactional
    @Override
    public Vehicle update(VehicleUpdateRequest vehicle, Integer id) {
        // Check if the vehicle exists
        Vehicle vehicleToUpdate = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));

        //Seteamos los nuevos valores
        if(vehicle.licensePlate() != null){
            vehicleToUpdate.setLicensePlate(vehicle.licensePlate());
        }
        if(vehicle.brand() != null){
            vehicleToUpdate.setBrand(vehicle.brand());
        }
        if(vehicle.model() != null){
            vehicleToUpdate.setModel(vehicle.model());
        }

        if(vehicle.year() != null){
            vehicleToUpdate.setYear(vehicle.year());
        }
        if(vehicle.color() != null){
            vehicleToUpdate.setColor(vehicle.color());
        }
        if(vehicle.details() != null){
            vehicleToUpdate.setDetails(vehicle.details());
        }

        if (vehicle.driver_id() != null) {
            if (vehicle.driver_id().equalsIgnoreCase("none")) {
                vehicleToUpdate.setDriver(null);
            } else {
                UUID driverUUID = UUID.fromString(vehicle.driver_id());
                Driver driver = driverRepository.findById(driverUUID)
                        .orElseThrow(() -> new EntityNotFoundException("Driver", "id", vehicle.driver_id()));
                vehicleToUpdate.setDriver(driver);
            }
        }

        vehicleToUpdate.setIsDisabled(vehicle.isDisabled());


        return vehicleRepository.save(vehicleToUpdate);
    }


    @Transactional
    public Vehicle updateStatusByOperator(Integer id, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateStatusByDriver(Integer id, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));
        if(vehicle.getDriver() == null){
            throw new VehicleException("You can't change the status of a vehicle that doesn't have a driver");
        }
        if(vehicle.getStatus() == VehicleStatus.ON_TRIP){
            throw new VehicleException("You can't change the status of a vehicle that is on trip");
        }
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }


    @Transactional(readOnly = true)
    @Override
    public Vehicle findById(Integer id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));
    }

    @Transactional (readOnly = true)
    @Override
    public Page<Vehicle> findAll(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));
        vehicleRepository.delete(vehicle);
    }

    @Override
    public ResultResponse restore(Integer id) {

        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id.toString()));
        if(!vehicle.isDeleted()){
            return new ResultResponse("Vehicle " +vehicle.getId()+ " is not deleted", HttpStatus.NOT_MODIFIED);
        }
        vehicle.setDeleted(false);
        vehicleRepository.save(vehicle);
        return new ResultResponse("Vehicle " +vehicle.getId()+ " restored successfully", HttpStatus.OK);

    }

    @Override
    public Page<Vehicle> findAllDeleted(Pageable pageable) {
        return vehicleRepository.findDeletedVehicles(pageable);
    }


    /**
     * Set driver to vehicle
     */
    @Transactional
    @Override
    public Vehicle setDriver(Integer vehicleId, UUID driverId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).
                orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", vehicleId.toString()));

        Driver driver = driverRepository.findById(driverId).
                orElseThrow(() -> new EntityNotFoundException("Driver", "id", driverId.toString()));

        if(vehicle.getDriver() != null){
            throw new VehicleException("The vehicle already has a driver");
        }
        vehicle.setDriver(driver);
        return vehicleRepository.save(vehicle);
    }


    @Transactional(readOnly = true)
    public Vehicle findByDriverId(UUID driverId) {
        return vehicleRepository.findByDriverId(driverId).orElseThrow(() -> new EntityNotFoundException("Vehicle and Driver", "driverId", driverId.toString()));
    }

    @Transactional(readOnly = true)
    public Vehicle findByDriverEmail(String email) {
        return vehicleRepository.findByDriverEmail(email).orElseThrow(() -> new EntityNotFoundException("Vehicle and Driver", "driverEmail", email));
    }


}
