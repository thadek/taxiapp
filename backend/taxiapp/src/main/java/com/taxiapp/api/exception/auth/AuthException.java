package com.taxiapp.api.exception.auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Builder
@Data
public class AuthException extends RuntimeException {
    String message;
    HttpStatus statusCode;

}
