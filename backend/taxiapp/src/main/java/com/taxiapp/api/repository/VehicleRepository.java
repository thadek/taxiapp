package com.taxiapp.api.repository;

import com.taxiapp.api.model.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(collectionResourceRel = "vehicle", path = "vehicles")
@Secured({"ROLE_USER", "ROLE_DRIVER", "ROLE_ADMIN","ROLE_OPERATOR"})
public interface VehicleRepository extends JpaRepository<Vehicle, String> {

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public void deleteById(String id);

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public void delete(Vehicle vehicle);

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public void deleteAll();

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public void deleteAll(Iterable<? extends Vehicle> vehicles);

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public Vehicle save(Vehicle vehicle);

    @Secured("ROLE_ADMIN, ROLE_OPERATOR")
    @Override
    public <S extends Vehicle> S saveAndFlush(S entity);


}
