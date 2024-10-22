package com.taxiapp.api.controller.ride;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    /**
     * Create a new ride from a user request
     * @param request
     * @return ResponseEntity<RideUserResponse>
     */
    @PostMapping
    public ResponseEntity<RideUserResponse> createRide(@RequestBody @Valid RideUserRequest request, Authentication auth) {





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
