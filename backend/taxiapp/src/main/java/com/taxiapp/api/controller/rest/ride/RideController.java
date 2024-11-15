package com.taxiapp.api.controller.rest.ride;

import com.taxiapp.api.controller.rest.driver.dto.DriverDTO;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.Ride;
import com.taxiapp.api.service.impl.RideServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

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
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public PagedModel<Ride> getAllRides(
            @PageableDefault() Pageable pageable
    ) {
        return new PagedModel<>(rideService.findAll(pageable));
    }

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public PagedModel<Ride> getRidesByStatus(
            @PathVariable @Valid RideStatus status,
            @PageableDefault() Pageable pageable
    ) {
        return new PagedModel<>(rideService.getRidesByStatus(status, pageable));
    }

    /**
     * Iniciar un viaje asignado a un conductor. SOLO el conductor asignado puede iniciar sus viajes
     * @param rideId
     * @param principal
     * @return
     */
    @PostMapping("/{rideId}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> startRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.startRide(rideId,principal), RideUserResponse.class));
    }




    /**
     * Create a new ride from a user request
     * @param request RideUserRequest
     * @return ResponseEntity<RideUserResponse>
     */
    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> requestRideFromClient(@RequestBody @Valid RideUserRequest request, Authentication auth) {
            return ResponseEntity.ok(rideService.createRideFromClient(request, auth.getPrincipal()));
    }



    /**
     * Create a new ride from an operator request
     * @param request RideOperatorRequest
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    @PostMapping()
    public ResponseEntity<RideUserResponse> createRide(@RequestBody @Valid RideOperatorRequest request) {
        return ResponseEntity.ok(modelMapper.map(rideService.createRideFromOperator(request), RideUserResponse.class));
    }


    /**
     * Get a ride by id
     * @param rideId String
     * @return ResponseEntity<RideUserResponse>
     */
    @GetMapping("/{rideId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER','OPERATOR')")
    public ResponseEntity<RideUserResponse> getRide(@PathVariable String rideId) {
        return ResponseEntity.ok(modelMapper.map(rideService.getRide(rideId), RideUserResponse.class));
    }


    /**
     *  Obtener mis viajes (cliente)
     *  @param pageable Pageable
     *  @return PagedModel<Ride>
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'OPERATOR')")
    public PagedModel<Ride> getMyRides(
            @PageableDefault() Pageable pageable,
            Authentication auth
    ) {
        return new PagedModel<>(rideService.getMyRides(auth.getPrincipal(), pageable));
    }

    /**
     *  Obtener mis viajes activos (cliente)
     *  @param pageable Pageable
     *  @return PagedModel<Ride>
     */
    @GetMapping("/my/active")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'OPERATOR')")
    public PagedModel<Ride> getMyActiveRides(
            @PageableDefault() Pageable pageable,
            Authentication auth
    ) {
        return new PagedModel<>(rideService.getMyActiveRides(auth.getPrincipal(), pageable));
    }


    /**
     * Aceptar un viaje asignado a un conductor. SOLO el conductor asignado puede aceptar sus viajes
     * @param rideId
     * @param principal
     * @return
     */
    @PostMapping("/{rideId}/accept")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> acceptRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.acceptRide(rideId, principal), RideUserResponse.class));
    }






    /**
     * Cancelar viaje que no se encuentre en estado Iniciado
     * @param rideId
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER', 'USER', 'OPERATOR')")
    @PostMapping("/{rideId}/client-cancel")
    public ResponseEntity<RideUserResponse> cancelRideFromClient(@PathVariable String rideId, Principal principal) {
            return ResponseEntity.ok(modelMapper.map(rideService.cancelRideFromClient(rideId, principal), RideUserResponse.class));
    }

    /**
     * Cancelar viaje siendo operador, admin o conductor
     * @param rideId
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN','DRIVER', 'OPERATOR')")
    @PostMapping("/{rideId}/operator-cancel")
    public ResponseEntity<Ride> cancelRideFromOperator(@PathVariable String rideId) {
        return ResponseEntity.ok(rideService.cancelRideFromOperator(rideId));
    }



    /**
     * Obtener info del auto y conductor asignado a un viaje
     * @param rideId
     * @return ResponseEntity<VehicleDTO>
     */

    @GetMapping("/{rideId}/driver")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable String rideId) {
        return ResponseEntity.ok(modelMapper.map(rideService.getVehicleInfo(rideId), VehicleDTO.class));
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
