package com.taxiapp.api.utils;

import com.taxiapp.api.exception.common.ValidationException;

import java.util.ArrayList;
import java.util.Date;

public class ValidationService {


    public static final String DD_COORDINATE_REGEX = "^(-?\\d+\\.\\d+)(\\s*,\\s*)?(-?\\d+\\.\\d+)$";

     public static void validateCoords(String coords,String field) {
         if (coords == null || coords.isEmpty()) {
             throw new ValidationException("Coords cannot be empty", field);
         }else if (!coords.matches(DD_COORDINATE_REGEX)) {
             throw new ValidationException("Coords must be in the format 'lat,lng'", field);
         }

     }

     public static void validateDate(Date date,String field) {

            if (date == null) {
                throw new ValidationException("Date cannot be empty", field);
            }

         //If date is lower than current date
            if (date.before(new Date())) {
                throw new ValidationException("Date cannot be lower than current date", field);
            }


     }


}
