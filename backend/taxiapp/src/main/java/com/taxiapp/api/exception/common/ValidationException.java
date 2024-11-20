package com.taxiapp.api.exception.common;

import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;

@ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

    ArrayList<String> errors;
    String field;
    public ValidationException(String message, ArrayList<String> errors) {
        super(message);
        this.errors = errors;
    }

    public ValidationException(String message, String field) {
        super(message);
        this.field = field;
    }
}
