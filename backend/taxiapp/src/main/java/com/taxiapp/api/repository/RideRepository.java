package com.taxiapp.api.repository;

import com.taxiapp.api.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideRepository extends JpaRepository<Ride, String> {

}
