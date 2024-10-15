package com.taxiapp.api.repository;

import com.taxiapp.api.model.Driver;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DriverRepository extends PagingAndSortingRepository<Driver, UUID>, CrudRepository<Driver,UUID> {

    public Driver findByLicenseId(String licenseId);
    public Iterable<Driver> findByIsAvailable(Boolean isAvailable);

}
