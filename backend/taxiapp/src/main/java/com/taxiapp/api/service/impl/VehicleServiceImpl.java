package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.vehicle.dto.VehicleCreateRequest;
import com.taxiapp.api.controller.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.model.Vehicle;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements IVehicleService {

    private final VehicleRepository vehicleRepository;


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

        return vehicleRepository.save(newVehicle);

    }

    @Transactional
    @Override
    public Vehicle update(VehicleUpdateRequest vehicle, String id) {
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

        return vehicleRepository.save(vehicleToUpdate);
    }


    @Transactional(readOnly = true)
    @Override
    public Vehicle findById(String id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id));
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Vehicle> findAll(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    @Transactional
    @Override
    public void delete(String id) {
        boolean exists = vehicleRepository.existsById(id);
        if(!exists){
            throw new EntityNotFoundException("Vehicle","id",id);
        }
        vehicleRepository.deleteById(id);

    }

    @Override
    public ResultResponse restore(String id) {

        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle", "id", id));
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
}
