package com.taxiapp.api.service;

import com.taxiapp.api.controller.rest.ride.RideOperatorRequest;
import com.taxiapp.api.controller.rest.ride.RideUserRequest;
import com.taxiapp.api.controller.rest.ride.RideUserResponse;
import com.taxiapp.api.entity.Ride;
import com.taxiapp.api.entity.Vehicle;
import com.taxiapp.api.enums.RideStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.security.Principal;
import java.util.List;

public interface IRideService {

     Page<Ride> findAll(Pageable pageable);
     Ride getRide(String rideId);
     Ride getCurrentRideForDriver(String driverEmail);
     Page<Ride> getRidesForDriverConfirm(String driverEmail, Pageable pageable);
     Page<Ride> getAllMyAssignedRides(Object principal, Pageable pageable);
     Page<Ride> getRidesByMultipleStatuses(List<RideStatus> rideStatuses, Pageable pageable);
     Page<Ride> getRidesByDriverEmailFilteredByState(String driverEmail,RideStatus rideStatus, Pageable pageable);
     Page<Ride> getRidesByStatus(RideStatus rideStatus, Pageable pageable);
     Ride createRideFromOperator(RideOperatorRequest request);
     RideUserResponse createRideFromClient(RideUserRequest request, Object principal);
     Ride assignVehicleToRide(String rideId, Integer vehicleId);
     Vehicle getVehicleInfo(String rideId);
     Page<Ride> getMyActiveRides(Object principal, Pageable pageable);
     Page<Ride> getMyRides(Object principal, Pageable pageable);

     Ride startRide(String rideId, Principal principal);
     Ride acceptRide(String rideId, String driverEmail);
     Ride completeRide(String rideId, String driverEmail);
     Ride rateRide(String rideId, Integer rating, Principal principal);
     Ride cancelRideFromOperator(String rideId);
     Ride cancelRideFromClient(String rideId, String userMail);
     Ride cancelRideFromDriver(String rideId, Principal principal);
     Ride rejectRide(String rideId, Principal principal);




}
