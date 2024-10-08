package com.taxiapp.api.service.exception.auth;


import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;


@Builder
@Getter
@Setter
public class AuthException extends AuthenticationException {
    String message;
    HttpStatus statusCode;

    public AuthException(String message, HttpStatus statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }

}
