package com.taxiapp.api.service;

import com.taxiapp.api.controller.vehicle.dto.VehicleCreateRequest;
import com.taxiapp.api.controller.vehicle.dto.VehicleUpdateRequest;
import com.taxiapp.api.model.Vehicle;
import com.taxiapp.api.utils.ResultResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IVehicleService {


    public Vehicle create(VehicleCreateRequest vehicle);
    public Vehicle update(VehicleUpdateRequest vehicle, String id);
    public Vehicle findById(String id);
    public Page<Vehicle> findAll(Pageable pageable);
    public void delete(String id);

    //Metodo para restaurar soft delete
    ResultResponse restore(String id);

    //Metodo para listar vehiculos eliminados por softdelete
    Page<Vehicle> findAllDeleted(Pageable pageable);

}
