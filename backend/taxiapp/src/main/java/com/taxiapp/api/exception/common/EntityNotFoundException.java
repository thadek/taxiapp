package com.taxiapp.api.exception.common;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(org.springframework.http.HttpStatus.NOT_FOUND)
public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String type, String field, String value) {
        super(String.format("%s with %s %s not found", type, field, value));
    }
}
