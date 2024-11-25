package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.rest.ride.RideOperatorRequest;
import com.taxiapp.api.controller.rest.ride.RideUserRequest;
import com.taxiapp.api.controller.rest.ride.RideUserResponse;
import com.taxiapp.api.enums.RideEvent;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.enums.VehicleStatus;
import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.exception.ride.RideException;
import com.taxiapp.api.entity.Ride;
import com.taxiapp.api.entity.User;
import com.taxiapp.api.entity.Vehicle;
import com.taxiapp.api.repository.RideRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.repository.VehicleRepository;
import com.taxiapp.api.service.IRideService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taxiapp.api.utils.ValidationService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;


@Service
@Data
@RequiredArgsConstructor
public class RideServiceImpl implements IRideService {


    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    //private final NotificationServiceImpl notificationService;
    private final ApplicationEventPublisher eventPublisher;


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
     * Obtener TODOS mis viajes asignados (conductor)
     */
    @Transactional(readOnly = true)
    public Page<Ride> getAllMyAssignedRides(Object principal, Pageable pageable) {
        return rideRepository.findByVehicleDriverEmail(principal.toString(), pageable);
    }


    /**
     * Obtener los viajes asignados a un conductor POR CONFIRMAR (DRIVER_ASSIGNED)
     * @param driverEmail
     * @param pageable
     * @return Page<Ride>
     */
    @Transactional(readOnly = true)
    public Page<Ride> getRidesForDriverConfirm(String driverEmail, Pageable pageable) {
        return rideRepository.findByVehicleDriverEmailAndStatus(driverEmail,RideStatus.DRIVER_ASSIGNED,pageable);
    }


    /**
     * Obtener el viaje actual en curso (conductor)
     * @param driverEmail
     * @return Ride
     */
    @Transactional(readOnly = true)
    public Ride getCurrentRideForDriver(String driverEmail) {
        return rideRepository.findFirstByVehicleDriverEmailAndStatusIn(driverEmail, List.of(RideStatus.ACCEPTED, RideStatus.STARTED)).orElse(null);
    }


    /**
     * Obtener los viajes asignados a un conductor filtrados por estado
     * @param driverEmail
     * @return List<Ride>
     */
    @Transactional(readOnly = true)
    public Page<Ride> getRidesByDriverEmailFilteredByState(String driverEmail,RideStatus rideStatus, Pageable pageable) {
        return rideRepository.findByVehicleDriverEmailAndStatus(driverEmail,rideStatus,pageable);
    }


    /**
     * Obtener los viajes por estado
     * @param rideStatus
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Ride> getRidesByStatus(RideStatus rideStatus, Pageable pageable) {
        Pageable pageableReq = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),Sort.by("createdAt").descending());
        return rideRepository.findByStatus(rideStatus,pageableReq);
    }


    /**
     * Obtener los viajes por multiples estados
     */
    @Transactional(readOnly = true)
    public Page<Ride> getRidesByMultipleStatuses(List<RideStatus> rideStatuses, Pageable pageable) {
        Pageable pageableReq = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),Sort.by("createdAt").descending());
        return rideRepository.findByStatusIn(rideStatuses,pageableReq);
    }


    /**
     * Obtener un viaje por id
     * @param rideId
     * @return Ride
     */
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
    @Transactional
    public Ride cancelRideFromClient(String rideId, String userMail) throws EntityNotFoundException {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
           throw new EntityNotFoundException("Ride", "id", rideId);
        }

        //Obtener el usuario logueado
        if(!Objects.equals(ride.getClient().getEmail(), userMail)) {
            throw new RideException("No tienes permiso para cancelar este viaje.");
        }

        switch(ride.getStatus()){
            case PENDING, DRIVER_ASSIGNED, ACCEPTED:
                ride.setStatus(RideStatus.CANCELLED);
                ride.setRide_end(new Date());
                break;
            case STARTED:
                throw new RideException("No se puede cancelar el viaje ya iniciado, debe cancelarlo el operador o el conductor.");
            case CANCELLED:
                throw new RideException("El viaje ya fue cancelado.");
            default:
                throw new RideException("No se puede cancelar el viaje en este momento.");
        }

        Ride cancelledRide = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.CANCELLED_BY_USER,cancelledRide));
        return cancelledRide;
    }


    /**
     * Cancelar un viaje (operador base)
     * Este metodo recibe el id de un viaje y lo cambia a estado CANCELLED
     * Notifica a los subscriptores del viaje que fue cancelado.
     * Si el viaje no existe, retorna null.
     * @param rideId
     * @return Ride
     */
    @Transactional
    public Ride cancelRideFromOperator(String rideId) throws EntityNotFoundException {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }
        ride.setStatus(RideStatus.CANCELLED);
        ride.setRide_end(new Date());

        Ride cancelledRide = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.CANCELLED_BY_OPERATOR,cancelledRide));
        return cancelledRide;
    }


    /**
     * Aceptar un viaje (conductor)
     Este metodo recibe el id de un viaje y lo cambia a estado ACCEPTED, lo guarda en la base de datos y lo retorna.
     */
    @Transactional
    public Ride acceptRide(String rideId, String driverEmail) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }

        if(ride.getStatus() != RideStatus.DRIVER_ASSIGNED){
            throw new RideException("No se puede aceptar un viaje que no está en estado DRIVER_ASSIGNED.");
        }

        //Obtener el conductor logueado
        if(!Objects.equals(ride.getVehicle().getDriver().getEmail(), driverEmail)) {
            throw new RideException("No tienes permiso para aceptar este viaje.");
        }

        if(ride.getVehicle().getStatus() != VehicleStatus.AVAILABLE){ //Esto se asegura de que el vehículo esté disponible y no se acepten dos viajes al mismo tiempo
            throw new RideException("El auto no está disponible.");
        }


        ride.setStatus(RideStatus.ACCEPTED);

        ride.getVehicle().setStatus(VehicleStatus.ON_TRIP); //TODO: Verificar si esto anda

        Ride acceptedRide = rideRepository.save(ride);

        //Notificar EL CAMBIO DE ESTADO DE RIDE despues de commitear transacción
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.ACCEPTED_BY_DRIVER,ride));

        return acceptedRide;
    }


    /**
     * Completar un viaje (conductor)
     * Este metodo recibe el id de un viaje y lo cambia a estado COMPLETED, lo guarda en la base de datos y lo retorna.
     * @param rideId
     */
    @Transactional
    public Ride completeRide(String rideId, String driverEmail) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }

        if(ride.getStatus() != RideStatus.STARTED){
            throw new RideException("No se puede completar un viaje que no está en estado STARTED.");
        }

        //Obtener el conductor logueado
        if(!Objects.equals(ride.getVehicle().getDriver().getEmail(), driverEmail)) {
            throw new RideException("No tienes permiso para completar este viaje.");
        }

        ride.setStatus(RideStatus.COMPLETED);
        ride.setRide_end(new Date());
        //Cambio el estado del vehículo a AVAILABLE
        ride.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        Ride completedRide = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.COMPLETED_BY_DRIVER,completedRide));
        return completedRide;
    }

    /**
     * Obtener mis viajes (cliente)
     */
    @Transactional(readOnly = true)
    public Page<Ride> getMyRides(Object principal, Pageable pageable) {
        User user = userRepository.findByEmail(principal.toString()).orElse(null);
        return rideRepository.findByClient(user, pageable);
    }




    /**
     * Obtener mis viajes activos (cliente)
     */
    @Transactional(readOnly = true)
    public Page<Ride> getMyActiveRides(Object principal, Pageable pageable) {
        User user = userRepository.findByEmail(principal.toString()).orElse(null);
        List<RideStatus> statuses = List.of(RideStatus.PENDING,RideStatus.ACCEPTED,RideStatus.STARTED,RideStatus.DRIVER_ASSIGNED);
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1); // Obtengo la fecha de una hora atras para comparar con la fecha de fin del viaje
        return rideRepository.findActiveAndRecentlyCancelledRidesByUserId(user.getId(),statuses,oneHourAgo,pageable);
    }





    /**
     * Iniciar un viaje (conductor)
     Este metodo recibe el id de un viaje y lo cambia a estado STARTED, lo guarda en la base de datos y lo retorna.
     */
    @Transactional
    public Ride startRide(String rideId, Principal principal) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }

        if(ride.getStatus() != RideStatus.ACCEPTED){
            throw new RideException("No se puede iniciar un viaje que no está en estado ACCEPTED.");
        }

        if(!Objects.equals(ride.getVehicle().getDriver().getEmail(), principal.getName())) {
            throw new RideException("No tienes permiso para iniciar este viaje.");
        }

        ride.setStatus(RideStatus.STARTED);
        //Seteo la fecha de inicio del viaje
        ride.setRide_start(new Date());
        //Cambio el estado del vehículo a ON_TRIP
        ride.getVehicle().setStatus(VehicleStatus.ON_TRIP); //TODO: Verificar si esto anda
        Ride startedRide = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.STARTED_BY_DRIVER,startedRide));
        return startedRide;

    }


    /**
     * Crear un viaje desde un request de usuario
     * @param request
     * @param principal
     * @return
     */
    @Transactional
    public RideUserResponse createRideFromClient(RideUserRequest request, Object principal) {

        Ride ride = new Ride();
        ValidationService.validateCoords(request.getPickupLocation(), "pickupLocation");
        ValidationService.validateCoords(request.getDropoffLocation(), "dropoffLocation");

        ride.setPickup_location(request.getPickupLocation());
        ride.setDropoff_location(request.getDropoffLocation());
        ride.setIs_booked(request.getIsBooked());
        //Si el viaje es programado, seteo la fecha de inicio
        if(request.getIsBooked()){
            ValidationService.validateDate(request.getRideStart(), "rideStart");
            ride.setRide_start(request.getRideStart());
            ride.setStatus(RideStatus.PROGRAMMED);
        }else{
            ride.setStatus(RideStatus.PENDING);
        }

        //Obtener el usuario logueado
        User user = userRepository.findByEmail(principal.toString()).orElse(null);

        ride.setClient(user);
        ride.setCreatedAt(new Date());
        ride.setUpdatedAt(new Date());


        ride.setComments(request.getComments());

        Ride rideCreated = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        if(request.getIsBooked()){
            eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideCreated.getId(), RideEvent.PROGRAMMED_BY_USER,rideCreated));
        } else {
            eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideCreated.getId(), RideEvent.CREATED_BY_USER, rideCreated));
        }

        return RideUserResponse.builder()
                .rideId(rideCreated.getId())
                .status(rideCreated.getStatus())
                .comments(rideCreated.getComments())
                .pickup_location(rideCreated.getPickup_location())
                .dropoff_location(rideCreated.getDropoff_location())
                .is_booked(ride.getIs_booked())
                .ride_start(ride.getRide_start())
                .build();

    }


    /**
     * Crear un viaje desde un request de operador
     * @param request
     * @return
     */
    @Transactional
    public Ride createRideFromOperator(RideOperatorRequest request) {
        Ride ride = new Ride();
        ValidationService.validateCoords(request.getPickupLocation(), "pickupLocation");
        ValidationService.validateCoords(request.getDropoffLocation(), "dropoffLocation");



        ride.setPickup_location(request.getPickupLocation());
        ride.setDropoff_location(request.getDropoffLocation());
        ride.setIs_booked(request.getIsBooked());
        //Si el viaje es programado, seteo la fecha de inicio
        if(request.getIsBooked()){
            ValidationService.validateDate(request.getRideStart(), "rideStart");
            ride.setRide_start(request.getRideStart());
            ride.setStatus(RideStatus.PROGRAMMED);

        }else{
            ride.setStatus(RideStatus.PENDING);
        }

        //Obtengo el usuario pasado por el request
        User user = userRepository.findById(request.getUserId()).orElseThrow(
                () -> new EntityNotFoundException("User", "id", request.getUserId().toString())
        );

        ride.setPrice(request.getPrice());
        ride.setClient(user);
        ride.setCreatedAt(new Date());
        ride.setUpdatedAt(new Date());
        ride.setComments(request.getComments());

        Ride rideCreated = rideRepository.save(ride);

        //Check si el viaje es programado o no y notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        if(request.getIsBooked()){
            eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideCreated.getId(), RideEvent.PROGRAMMED_BY_OPERATOR,rideCreated));
        } else {
            eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideCreated.getId(), RideEvent.CREATED_BY_OPERATOR, rideCreated));
        }

        return rideCreated;
    }

    /**
     * Obtener la info del auto y conductor asignado a un viaje
     * @param rideId
     * @return Vehicle
     */
    public Vehicle getVehicleInfo(String rideId) {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }
        if (ride.getVehicle() != null && ride.getVehicle().getDriver() != null) {
            return ride.getVehicle();
        }
        if(ride.getStatus() == RideStatus.PENDING){
            throw new RideException("Todavía no se ha asignado un auto a este viaje.");
        }
        if(ride.getStatus() == RideStatus.CANCELLED){
            throw new RideException("El viaje fue cancelado.");
        }
        throw new RideException("No se puede obtener la información del auto en este momento.");
    }


    /***
     * Asignar un auto a un viaje (OPERADOR o ADMIN)
     */
    @Transactional
    public Ride assignVehicleToRide(String rideId, Integer vehicleId) {
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
            throw new EntityNotFoundException("Vehicle", "id", vehicleId.toString());
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
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.DRIVER_ASSIGNED_BY_OPERATOR,updated));

        return updated;
    }


    /**
     * Cancelar un viaje (conductor)
     * @param rideId
     * @param principal
     * @return
     */
    public Ride cancelRideFromDriver(String rideId, Principal principal) {

        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            throw new EntityNotFoundException("Ride", "id", rideId);
        }

        if(ride.getStatus() != RideStatus.ACCEPTED && ride.getStatus() != RideStatus.STARTED && ride.getStatus() != RideStatus.DRIVER_ASSIGNED){
            throw new RideException("No se puede cancelar un viaje que no está Aceptado, Iniciado o Asignado.");
        }

        //Obtener el conductor logueado
        if(!Objects.equals(ride.getVehicle().getDriver().getEmail(), principal.getName())) {
            throw new RideException("No tienes permiso para cancelar este viaje.");
        }

        ride.setStatus(RideStatus.CANCELLED);
        ride.setRide_end(new Date());
        //Cambio el estado del vehículo a AVAILABLE
        ride.getVehicle().setStatus(VehicleStatus.AVAILABLE); //TODO: Verificar si esto anda
        Ride cancelledRide = rideRepository.save(ride);

        //Notificar a subscriptores DEL CAMBIO DE ESTADO DE RIDE
        eventPublisher.publishEvent(new RideStatusChangeEvent(this, rideId, RideEvent.CANCELLED_BY_DRIVER,cancelledRide));
        return cancelledRide;

    }
}


