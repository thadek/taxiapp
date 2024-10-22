package com.taxiapp.api.exception.ride;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RideException extends RuntimeException {
    public RideException(String message) {
        super(message);
    }
}
