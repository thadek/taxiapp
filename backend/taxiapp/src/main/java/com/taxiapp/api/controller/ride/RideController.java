package com.taxiapp.api.controller.ride;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rides")
public class RideController {

    @PostMapping
    public ResponseEntity<RideUserResponse> createRide(@RequestBody @Valid RideUserRequest request, BindingResult result) {

        if(result.hasErrors()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,result.getAllErrors().toString());
        }

        return ResponseEntity.ok().build();

    }



    public void getRide() {
        // Get a ride
    }

    public void updateRide() {
        // Update a ride
    }

    public void deleteRide() {
        // Delete a ride
    }
}
