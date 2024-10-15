package com.taxiapp.api.exception.common;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(org.springframework.http.HttpStatus.CONFLICT)
public class DuplicatedEntityException extends RuntimeException {
    public DuplicatedEntityException(String type, String field, String value) {
        super(String.format("%s with %s %s already exists", type, field, value));
    }
}
