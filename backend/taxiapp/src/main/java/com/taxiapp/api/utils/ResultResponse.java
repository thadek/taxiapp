package com.taxiapp.api.utils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.http.HttpStatus;

public record ResultResponse(String message, HttpStatus status) {
}
