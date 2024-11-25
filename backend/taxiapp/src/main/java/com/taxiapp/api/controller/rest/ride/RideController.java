package com.taxiapp.api.controller.rest.ride;

import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.entity.Ride;
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
import java.util.List;

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
     * Obtener los viajes por multiples estados
     */
    @GetMapping("/by-status")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public PagedModel<Ride> getRidesByStatus(
            @RequestParam @Valid RideStatus[] states,
            @PageableDefault() Pageable pageable
    ) {
        return new PagedModel<>(rideService.getRidesByMultipleStatuses(List.of(states), pageable));
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
     * Obtener los viajes asignados a un conductor por confirmar (driverassigned)
     * @param pageable Pageable
     * @return PagedModel<Ride>
     */
    @GetMapping("/driver/assigned")
    @PreAuthorize("hasAnyRole('DRIVER')")
    public PagedModel<Ride> getDriverAssignedRides(
            @PageableDefault() Pageable pageable,
            Principal principal
    ) {
        return new PagedModel<>(rideService.getRidesForDriverConfirm(principal.getName(), pageable));
    }


    /**
     * Obtener el viaje actual en curso (conductor)
     */
    @GetMapping("/driver/current")
    @PreAuthorize("hasAnyRole('DRIVER')")
    public ResponseEntity<Ride> getCurrentRide(Principal principal) {
        return ResponseEntity.ok(rideService.getCurrentRideForDriver(principal.getName()));
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
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public ResponseEntity<RideDTO> getRide(@PathVariable String rideId) {
        return ResponseEntity.ok(modelMapper.map(rideService.getRide(rideId), RideDTO.class));
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
    @PreAuthorize("hasAnyRole('ADMIN','DRIVER')")
    public ResponseEntity<RideUserResponse> acceptRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.acceptRide(rideId, principal.getName()), RideUserResponse.class));
    }


    /**
     * Completar un viaje (conductor)
     * @param rideId
     * @param principal
     */
    @PostMapping("/{rideId}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<RideUserResponse> completeRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.completeRide(rideId, principal.getName()), RideUserResponse.class));
    }




    /**
     * Cancelar viaje que no se encuentre en estado Iniciado
     * @param rideId
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER', 'USER', 'OPERATOR')")
    @PostMapping("/{rideId}/client-cancel")
    public ResponseEntity<RideUserResponse> cancelRideFromClient(@PathVariable String rideId, Principal principal) {
            return ResponseEntity.ok(modelMapper.map(rideService.cancelRideFromClient(rideId, principal.getName()), RideUserResponse.class));
    }

    /**
     * Cancelar viaje siendo operador, admin o conductor
     * @param rideId
     * @return ResponseEntity<RideUserResponse>
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PostMapping("/{rideId}/operator-cancel")
    public ResponseEntity<Ride> cancelRideFromOperator(@PathVariable String rideId) {
        return ResponseEntity.ok(rideService.cancelRideFromOperator(rideId));
    }

    /**
     * Cancelar viaje siendo conductor
     */
    @PreAuthorize("hasAnyRole('DRIVER')")
    @PostMapping("/{rideId}/driver-cancel")
    public ResponseEntity<RideUserResponse> cancelRideFromDriver(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.cancelRideFromDriver(rideId, principal), RideUserResponse.class));
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
    public ResponseEntity<RideUserResponse> assignVehicleToRide(@PathVariable String rideId, @PathVariable Integer vehicleId) {
        return ResponseEntity.ok(modelMapper.map(rideService.assignVehicleToRide(rideId, vehicleId), RideUserResponse.class));
    }


    /**
     * Rechazar un viaje asignado a un conductor. SOLO el conductor asignado puede rechazar sus viajes
     * @param rideId
     * @param principal
     * @return
     */
    @PostMapping("/{rideId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<RideDTO> rejectRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.rejectRide(rideId, principal), RideDTO.class));
    }

    /**
     * Calificar un viaje
     * @param rideId
     * @param rating
     * @param principal
     * @return
     */
    @PostMapping("/{rideId}/rate")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<RideUserResponse> rateRide(@PathVariable String rideId, @RequestParam Integer rating, Principal principal) {
        return ResponseEntity.ok(modelMapper.map(rideService.rateRide(rideId, rating, principal), RideUserResponse.class));
    }




}
