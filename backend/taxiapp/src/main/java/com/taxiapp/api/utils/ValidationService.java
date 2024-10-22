package com.taxiapp.api.utils;

import com.taxiapp.api.exception.common.ValidationException;

import java.util.ArrayList;

public class ValidationService {

     public static void validateCoords(String coords,String field) {
         if (coords == null || coords.isEmpty()) {
             throw new ValidationException("Coords cannot be empty", field);
         }else if (!coords.matches("^-?\\d{1,3}\\.\\d{6},-?\\d{1,3}\\.\\d{6}$")) {
             throw new ValidationException("Coords must be in the format 'lat,lng'", field);
         }


     }


}
