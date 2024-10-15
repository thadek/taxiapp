package com.taxiapp.api.controller.user;


import com.taxiapp.api.controller.user.dto.UserCreateRequest;
import com.taxiapp.api.controller.user.dto.UserDTO;
import com.taxiapp.api.controller.user.dto.UserUpdateRequest;
import com.taxiapp.api.controller.user.mapper.UserMapper;
import com.taxiapp.api.model.User;
import com.taxiapp.api.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN','ROLE_DRIVER','ROLE_OPERATOR')")
public class UserController {

    private final UserServiceImpl userServiceImpl;


    /**
     * Get all users
     * @param pageable
     * @return
     */
    @GetMapping
    public PagedModel<UserDTO> getAllUsers(
      @PageableDefault(page=0,size=10) Pageable pageable
    ) {
        Page<User> users = userServiceImpl.findAll(pageable);
        return new PagedModel<>(users.map(UserMapper::toUserDTO));
    }

    /**
     * Create a new user
     * @param user
     * @return UserDTO
     */
    @PostMapping()
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserCreateRequest user) {
        return new ResponseEntity<>(UserMapper.toUserDTO(userServiceImpl.create(user)),HttpStatus.CREATED);
    }

    /**
     *
     * @param id
     * @return UserDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(UserMapper.toUserDTO(userServiceImpl.findById(id)));
    }


    /**
     * Update a user
     * @param user
     * @return UserDTO
     */
    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody @Valid UserUpdateRequest user) {
        return ResponseEntity.ok(UserMapper.toUserDTO(userServiceImpl.update(user,id)));
    }


    /**
     * Delete a user
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userServiceImpl.delete(id);
        return ResponseEntity.noContent().build();
    }
}
