package com.taxiapp.api.repository;

import com.taxiapp.api.model.dto.IUserDTO;
import com.taxiapp.api.model.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;
import java.util.UUID;

@RepositoryRestResource(excerptProjection= IUserDTO.class,path = "users")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface UserRepository extends PagingAndSortingRepository<User, UUID>, CrudRepository<User,UUID> {

    Optional<User> findByUsername(@Param("username") String username);

    Optional<User> findByEmail(@Param("email") String email);

    Optional<User>findByUsernameAndEmail(@Param("username") String username, @Param("email") String email);


}
