package com.taxiapp.api.repository;

import com.taxiapp.api.model.Driver;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverRepository extends PagingAndSortingRepository<Driver, UUID>, CrudRepository<Driver,UUID> {

    Optional<Driver> findByLicenseId(String licenseId);
    public List<Driver> findByIsAvailable(Boolean isAvailable);

    @Modifying
    @Transactional
    @Query(value="INSERT INTO driver (is_available,license_id,rating,id) VALUES (:isAvailable,:licenseId,'5',:userId)",nativeQuery = true)
    void create(UUID userId, String licenseId, Boolean isAvailable);


    @Modifying
    @Transactional
    @Query(value="DELETE FROM driver  WHERE id = :id",nativeQuery = true)
    void deleteById(UUID id);


    Optional<Driver> findByEmail(String email);

}
