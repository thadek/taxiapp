package com.taxiapp.api.service;

import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.entity.Ride;
import com.taxiapp.api.repository.RideRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Data
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;


    /**
     * Solicitar un viaje (cliente)
     Este metodo crea un nuevo viaje en estado PENDING, lo guarda en la base de datos y lo retorna.
     */
    public Ride requestRide(Ride ride){
        ride.setStatus(RideStatus.PENDING);
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



}
