package com.taxiapp.api.repository;

import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, String> {

    List<Ride> findByStatus(RideStatus rideStatus);
}
