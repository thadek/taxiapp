package com.taxiapp.api.repository;

import com.taxiapp.api.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, UUID>, JpaRepository<User,UUID> {

    Optional<User> findByUsername(@Param("username") String username);

    Optional<User> findByEmail(@Param("email") String email);

    Optional<User>findByUsernameAndEmail(@Param("username") String username, @Param("email") String email);

    boolean existsByEmail(String email);


}
