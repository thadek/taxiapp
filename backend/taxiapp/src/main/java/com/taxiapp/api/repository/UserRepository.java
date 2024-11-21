package com.taxiapp.api.repository;

import com.taxiapp.api.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    //Metodo para listar usuarios eliminados por softdelete
    @Query(value="SELECT u FROM User u WHERE u.deleted = true")
    Page<User> findDeletedUsers(Pageable pageable);


    @Query(value="SELECT u FROM User u WHERE u.deleted = false")
    Page<User>findAll(Pageable pageable);


    @Query("UPDATE User u SET u.deleted = false WHERE u.id = :id")
    void restoreById(UUID id);

    Optional<User> findByPhone(String phone);
}
