package com.taxiapp.api.service;


import com.taxiapp.api.controller.user.dto.UserCreateRequest;
import com.taxiapp.api.controller.user.dto.UserUpdateRequest;
import com.taxiapp.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IUserService {

    void createDefaultAdminUserIfNotFound();
    User create(UserCreateRequest user);
    User update(UserUpdateRequest user, UUID id);
    void delete(UUID id);
    User findById(UUID id);
    User findByUsername(String username);
    User findByEmail(String email);
    Page<User> findAll(Pageable pageable);


}
