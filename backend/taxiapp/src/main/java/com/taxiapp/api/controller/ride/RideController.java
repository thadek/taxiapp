package com.taxiapp.api.controller.ride;

import com.taxiapp.api.controller.driver.dto.DriverDTO;
import com.taxiapp.api.controller.user.dto.UserDTO;
import com.taxiapp.api.controller.user.mapper.UserMapper;
import com.taxiapp.api.model.Ride;
import com.taxiapp.api.model.User;
import com.taxiapp.api.service.impl.RideServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rides")
public class RideController {

    private final RideServiceImpl rideService;
    private final ModelMapper modelMapper;


    /**
     * Get all rides
     * @param pageable Pageable
     * @return PagedModel<Ride>
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PagedModel<Ride> getAllRides(
            @PageableDefault() Pageable pageable
    ) {
        return new PagedModel<>(rideService.findAll(pageable));
    }



    /**
     * Create a new ride from a user request
     * @param request
     * @return ResponseEntity<RideUserResponse>
     */
    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> requestRideFromClient(@RequestBody @Valid RideUserRequest request, Authentication auth) {
            return ResponseEntity.ok(rideService.createRideFromClient(request, auth.getPrincipal()));
    }


    @GetMapping("/{rideId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> getRide(@PathVariable String rideId) {
        return ResponseEntity.ok(modelMapper.map(rideService.getRide(rideId), RideUserResponse.class));
    }




    /**
     * Cancelar viaje que no se encuentre en estado Iniciado
     * @param rideId
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER', 'USER', 'OPERATOR')")
    @PostMapping("/{rideId}/cancel")
    public ResponseEntity cancelRide(@PathVariable String rideId) {
            return ResponseEntity.ok(rideService.cancelRideFromClient(rideId));
    }


    /**
     * Obtener info del conductor asignado a un viaje
     * @param rideId
     * @return ResponseEntity<UserDTO>
     */

    @GetMapping("/{rideId}/driver")
    public ResponseEntity<DriverDTO> getDriver(@PathVariable String rideId) {
        return ResponseEntity.ok(modelMapper.map(rideService.getDriverInfo(rideId), DriverDTO.class));
    }


    /**
     * Asignar un auto a un viaje
     */
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    @PostMapping("/{rideId}/vehicle/{vehicleId}")
    public ResponseEntity<RideUserResponse> assignVehicleToRide(@PathVariable String rideId, @PathVariable String vehicleId) {
        return ResponseEntity.ok(modelMapper.map(rideService.assignVehicleToRide(rideId, vehicleId), RideUserResponse.class));
    }

}
