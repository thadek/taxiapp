package com.taxiapp.api.repository;

import com.taxiapp.api.model.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.access.annotation.Secured;

@Secured({"ROLE_USER", "ROLE_DRIVER", "ROLE_ADMIN","ROLE_OPERATOR"})

public interface RideRepository extends JpaRepository<Ride, String> {

}
