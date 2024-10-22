package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.ride.RideUserRequest;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.exception.ride.RideException;
import com.taxiapp.api.model.Ride;
import com.taxiapp.api.repository.RideRepository;
import com.taxiapp.api.service.IRideService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
@RequiredArgsConstructor
public class RideServiceImpl implements IRideService {


    private final RideRepository rideRepository;


    /**
     * Solicitar un viaje (cliente)
     Este metodo crea un nuevo viaje en estado PENDING, lo guarda en la base de datos y lo retorna.
     Notifica a los subscriptores del viaje que fue creado.
     */
    public Ride requestRide(RideUserRequest rideUserRequest) {
        Ride ride = new Ride();

        ride.setStatus(RideStatus.PENDING);
        return rideRepository.save(ride);

    }



    /**
     * Cancelar un viaje (cliente)
     * Este metodo recibe el id de un viaje y lo cambia a estado CANCELLED SOLO si el viaje está en estado PENDING.
     * Notifica a los subscriptores del viaje que fue cancelado.
     * Si el viaje no existe, retorna null.
     * @param rideId
     * @return Ride
     */
    public Ride cancelRideFromClient(String rideId) throws EntityNotFoundException {
        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
           throw new EntityNotFoundException("Ride", "id", rideId);
        }
        if (ride.getStatus() == RideStatus.PENDING) {
            ride.setStatus(RideStatus.CANCELLED);
            return rideRepository.save(ride);
        }
        throw new RideException("No se puede cancelar el viaje ya iniciado, debe cancelarlo el operador o el conductor.");
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
    public List<Ride> getPendingRide() {
        return rideRepository.findByStatus(RideStatus.PENDING);
    }






}
