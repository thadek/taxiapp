package com.taxiapp.api.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class ValidationExceptionHandler {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, Object> originalResponse = new HashMap<>();
        originalResponse.put("timestamp", LocalDateTime.now().format(formatter));
        originalResponse.put("status", HttpStatus.BAD_REQUEST.value());
        originalResponse.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        originalResponse.put("message", "Validation error");

        // Simplificar los errores de validación
        List<Map<String, String>> simplifiedErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> {
                    Map<String, String> errorDetails = new HashMap<>();
                    errorDetails.put("field", error.getField());
                    errorDetails.put("message", error.getDefaultMessage());
                    return errorDetails;
                })
                .collect(Collectors.toList());

        // Agregar la sección simplificada "errors"
        originalResponse.put("errors", simplifiedErrors);

        return new ResponseEntity<>(originalResponse, HttpStatus.BAD_REQUEST);
    }
}