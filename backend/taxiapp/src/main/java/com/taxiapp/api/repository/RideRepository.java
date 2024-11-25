package com.taxiapp.api.repository;

import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.entity.Ride;
import com.taxiapp.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RideRepository extends JpaRepository<Ride, String>, PagingAndSortingRepository<Ride, String> {

    Page<Ride> findByStatus(RideStatus rideStatus, Pageable pageable);

    Page<Ride> findByVehicleDriverEmail(String email, Pageable pageable);

    Page<Ride> findByVehicleDriverEmailAndStatus(String email, RideStatus rideStatus, Pageable pageable);

    Page<Ride> findByClient(User user, Pageable pageable);

    Page<Ride> findByClientAndStatusIn(User user, List<RideStatus> rideStatuses, Pageable pageable);

    Page<Ride> findByStatusIn(List<RideStatus> rideStatuses, Pageable pageable);

    Optional<Ride> findFirstByVehicleDriverEmailAndStatusIn(String email, List<RideStatus> statuses);

    @Query(value = """
    SELECT * 
    FROM ride r 
    WHERE r.user_id = :userId 
      AND (
        r.status IN :statuses 
        OR (r.status = 7 AND r.ride_end > :oneHourAgo)
      )
    """, nativeQuery = true)
    Page<Ride> findActiveAndRecentlyCancelledRidesByUserId(
            @Param("userId") UUID userId,
            @Param("statuses") List<RideStatus> statuses,
            @Param("oneHourAgo") LocalDateTime oneHourAgo,
            Pageable pageable
    );


    List<Ride> findByStatus(RideStatus rideStatus);

}
