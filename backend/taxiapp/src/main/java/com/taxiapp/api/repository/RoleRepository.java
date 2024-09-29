package com.taxiapp.api.repository;

import com.taxiapp.api.model.entity.Role;
import com.taxiapp.api.model.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "role", path = "roles")
public interface RoleRepository extends PagingAndSortingRepository<Role, Integer>, CrudRepository<Role,Integer> {

    public Optional<Role> findByName(String name);
}

