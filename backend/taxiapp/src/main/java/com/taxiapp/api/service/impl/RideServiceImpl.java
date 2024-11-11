package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.driver.dto.DriverDTO;
import com.taxiapp.api.controller.ride.RideUserRequest;
import com.taxiapp.api.controller.ride.RideUserResponse;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.exception.ride.RideException;
import com.taxiapp.api.model.Driver;
import com.taxiapp.api.model.Ride;
import com.taxiapp.api.model.User;
import com.taxiapp.api.model.Vehicle;
import com.taxiapp.api.repository.RideRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.repository.VehicleRepository;
import com.taxiapp.api.service.IRideService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taxiapp.api.utils.ValidationService;

import java.util.Date;
import java.util.List;



@Service
@Data
@RequiredArgsConstructor
public class RideServiceImpl implements IRideService {


    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationServiceImpl notificationService;


    /**
     * Get all rides paginated
     * @param pageable
     * @return Page<Ride>
     */
    @Transactional(readOnly = true)
    @Override
    public Page<Ride> findAll(Pageable pageable) {
        return rideRepository.findAll(pageable);
    }





    /**
     * Solicitar un viaje (cliente)
     Este metodo crea un nuevo viaje en estado PENDING, lo guarda en la base de datos y lo retorna.
     Notifica a los subscriptores del viaje que fue creado.
     */
    public Ride requestRide(RideUserRequest rideUserRequest) {
        Ride ride = new Ride();
        ride.setStatus(RideStatus.PENDING);
        //(Notificacion a los subscriptores)
        return rideRepository.save(ride);

    }

    public Ride getRide(String rideId) {
        return rideRepository.findById(rideId).orElseThrow(
                () -> new EntityNotFoundException("Ride", "id", rideId)
        );
    }


    /**
     * Cancelar un viaje (cliente)
     * Este metodo recibe el id de un viaje y lo cambia a estado CANCELLED SOLO si el viaje está en estado PENDING.
     * Notifica a los subscriptores del viaje que fue cancelado.
     * Si el viaje no existe, throwea EntityNotFoundException.
     * Si el viaje no está en estado PENDING, throwea RideException.
     * @param rideId
     * @return Ride
     */
    public Ride cancelRideFromClient(String rideId) throws EntityNotFoundException {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
           throw new EntityNotFoundException("Ride", "id", rideId);
        }
        if (ride.getStatus() == RideStatus.PENDING || ride.getStatus() == RideStatus.DRIVER_ASSIGNED) {
            ride.setStatus(RideStatus.CANCELLED);
            //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
            return rideRepository.save(ride);
        }

        if(ride.getStatus() == RideStatus.CANCELLED){
            throw new RideException("El viaje ya fue cancelado.");
        }

        if(ride.getStatus() == RideStatus.STARTED) {
            throw new RideException("No se puede cancelar el viaje ya iniciado, debe cancelarlo el operador o el conductor.");
        }
        
        throw new RideException("No se puede cancelar el viaje en este momento.");

    }


    /**
     * Cancelar un viaje (operador base)
     * Este metodo recibe el id de un viaje y lo cambia a estado CANCELLED
     * Notifica a los subscriptores del viaje que fue cancelado.
     * Si el viaje no existe, retorna null.
     * @param rideId
     * @return Ride
     */
    public Ride cancelRideFromOperator(String rideId) throws EntityNotFoundException {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }
        ride.setStatus(RideStatus.CANCELLED);
        return rideRepository.save(ride);
    }


    /**
     * Aceptar un viaje (operador base)
     Este metodo recibe el id de un viaje y lo cambia a estado ACCEPTED, lo guarda en la base de datos y lo retorna.
     */
    public Ride acceptRide(String rideId) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            return null;
        }
        ride.setStatus(RideStatus.ACCEPTED);
        return rideRepository.save(ride);
    }


    /**
     * Iniciar un viaje (operador base)
     Este metodo recibe el id de un viaje y lo cambia a estado STARTED, lo guarda en la base de datos y lo retorna.
     */
    public Ride startRide(String rideId) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            return null;
        }
        ride.setStatus(RideStatus.STARTED);
        return rideRepository.save(ride);
    }


    /**
     * Obtener las solicitudes de viaje pendientes (operador base)
     */
    public List<Ride> getPendingRides() {
        return rideRepository.findByStatus(RideStatus.PENDING);
    }


    @Transactional
    public RideUserResponse createRideFromClient(RideUserRequest request, Object principal) {

        Ride ride = new Ride();
        ValidationService.validateCoords(request.getPickupLocation(), "pickupLocation");
        ValidationService.validateCoords(request.getDropoffLocation(), "dropoffLocation");

        ride.setPickup_location(request.getPickupLocation());
        ride.setDropoff_location(request.getDropoffLocation());
        ride.setIs_booked(request.getIsBooked());
        if(request.getIsBooked()){
            ride.setRide_start(request.getRideStart());
        }

        //Obtener el usuario logueado
        User user = userRepository.findByEmail(principal.toString()).orElse(null);
        if (user == null) {
            throw new EntityNotFoundException("User", "email", principal.toString());
        }
        ride.setClient(user);
        ride.setCreated_at(new Date());
        ride.setUpdated_at(new Date());
        ride.setStatus(RideStatus.PENDING);


        Ride rideCreated = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE


        return RideUserResponse.builder()
                .rideId(rideCreated.getId())
                .status(rideCreated.getStatus())
                .pickup_location(rideCreated.getPickup_location())
                .dropoff_location(rideCreated.getDropoff_location())
                .price(rideCreated.getPrice())
                .is_booked(ride.getIs_booked())
                .ride_start(ride.getRide_start())
                .build();

    }


    /**
     * Obtener la información del conductor asignado a un viaje
     * @param rideId
     * @return Driver
     */
    public Driver getDriverInfo(String rideId) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }
        if (ride.getVehicle() != null && ride.getVehicle().getDriver() != null) {
            return ride.getVehicle().getDriver();
        }
        if(ride.getStatus() == RideStatus.PENDING){
            throw new RideException("Todavía no se ha asignado un conductor a este viaje.");
        }
        if(ride.getStatus() == RideStatus.CANCELLED){
            throw new RideException("El viaje fue cancelado.");
        }
        throw new RideException("No se puede obtener la información del conductor en este momento.");
    }


    /***
     * Asignar un auto a un viaje (OPERADOR o ADMIN)
     */
    @Transactional
    public Ride assignVehicleToRide(String rideId, String vehicleId) {
        //Obtengo el viaje
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }
        if(ride.getStatus() != RideStatus.PENDING){
            throw new RideException("No se puede asignar un vehículo a un viaje que no está en estado PENDING.");
        }
        //Obtengo el vehículo
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
        if (vehicle == null) {
            throw new EntityNotFoundException("Vehicle", "id", vehicleId);
        }
        if(vehicle.getDriver() == null){
            throw new RideException("El vehículo no tiene conductor asignado.");
        }

        //Chequeo disponibilidad del vehículo
        if(vehicle.getIsDisabled() != null){
            throw new RideException("El vehículo no está disponible.");
        }
        //Chequeo disponibilidad del conductor
        if(!vehicle.getDriver().getIsAvailable()){
            throw new RideException("El conductor no está disponible.");
        }

        //Asigno el vehículo al viaje
        ride.setVehicle(vehicle);

        //Seteo el estado del viaje a DRIVER_ASSIGNED
        ride.setStatus(RideStatus.DRIVER_ASSIGNED);


        Ride updated = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        notificationService.sendRideNotification(updated);

        return updated;
    }


}


