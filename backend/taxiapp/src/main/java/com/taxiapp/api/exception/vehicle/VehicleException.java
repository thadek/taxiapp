package com.taxiapp.api.exception.vehicle;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class VehicleException extends RuntimeException {
    public VehicleException(String message) {
        super(message);
    }
}


