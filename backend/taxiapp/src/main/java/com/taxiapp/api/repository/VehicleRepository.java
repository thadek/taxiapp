package com.taxiapp.api.repository;

import com.taxiapp.api.entity.Vehicle;
import com.taxiapp.api.enums.VehicleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    boolean existsByLicensePlate(String licensePlate);

    Vehicle findByLicensePlate(String licensePlate);

    @Query(value="SELECT v FROM Vehicle v WHERE v.deleted = false")
    Page<Vehicle> findAll(Pageable pageable);


    @Query("UPDATE Vehicle v SET v.deleted = false WHERE v.id = :id")
    void restoreById(Integer id);

    @Query(value="SELECT v FROM Vehicle v WHERE v.deleted = true")
    Page<Vehicle> findDeletedVehicles(Pageable pageable);

    Optional<Vehicle> findByDriverId(UUID driverId);

    Optional<Vehicle> findByDriverEmail(String email);

    Page<Vehicle> findByStatusIn(List<VehicleStatus> statuses, Pageable pageable);

}
