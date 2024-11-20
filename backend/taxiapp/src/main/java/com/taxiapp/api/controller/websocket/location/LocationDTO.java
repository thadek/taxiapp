package com.taxiapp.api.controller.websocket.location;

import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;



public record LocationDTO(Double x, Double y, VehicleDTO vehicle ) {
}
