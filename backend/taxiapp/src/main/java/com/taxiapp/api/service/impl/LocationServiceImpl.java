package com.taxiapp.api.service.impl;


import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.controller.websocket.location.LocationDTO;
import com.taxiapp.api.model.Location;
import com.taxiapp.api.entity.Vehicle;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.Principal;


@Service
@RequiredArgsConstructor
public class LocationServiceImpl {


    private final VehicleServiceImpl vehicleServiceImpl;
    private final ModelMapper modelMapper;



    @Async
    public LocationDTO getVehicleLocation(Location location, Principal principal) {
        Vehicle vehicle = vehicleServiceImpl.findByDriverEmail(principal.getName());
        return new LocationDTO(location.x(), location.y(), modelMapper.map(vehicle, VehicleDTO.class));
    }


}
