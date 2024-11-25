package com.taxiapp.api.repository;

import com.taxiapp.api.model.Report;
import com.taxiapp.api.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    boolean existsByRideId(String rideId);

    Optional<Report> findByRideId(String rideId);

    @Query(value="SELECT r FROM Report r")
    Page<Report> findAll(Pageable pageable);

}