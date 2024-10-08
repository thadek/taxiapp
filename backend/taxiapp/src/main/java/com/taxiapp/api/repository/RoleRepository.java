package com.taxiapp.api.repository;

import com.taxiapp.api.model.entity.Role;
import com.taxiapp.api.model.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "role", path = "roles")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface RoleRepository extends PagingAndSortingRepository<Role, Integer>, CrudRepository<Role,Integer> {

    public Optional<Role> findByName(String name);
}

