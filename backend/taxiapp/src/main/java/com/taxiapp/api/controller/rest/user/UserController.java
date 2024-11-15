package com.taxiapp.api.controller.rest.user;


import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.controller.rest.user.dto.UserUpdateRequest;
import com.taxiapp.api.controller.rest.user.mapper.UserMapper;
import com.taxiapp.api.controller.rest.user.dto.UserCreateRequest;
import com.taxiapp.api.model.User;
import com.taxiapp.api.service.impl.UserServiceImpl;
import com.taxiapp.api.utils.ResultResponse;
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
@PreAuthorize("hasAnyRole('OPERATOR','ADMIN')")
public class UserController {

    private final UserServiceImpl userServiceImpl;


    /**
     * Get all users
     * @param pageable Pageable
     * @return PagedModel<UserDTO>
     */
    @GetMapping
    public PagedModel<UserDTO> getAllUsers(
      @PageableDefault() Pageable pageable,
      @RequestParam(required = false, value = "deleted") boolean deleted
    ) {
        Page<User> users;
        if(deleted){
            users = userServiceImpl.findAllDeleted(pageable);
        }else{
            users = userServiceImpl.findAll(pageable);
        }
        return new PagedModel<>(users.map(UserMapper::toUserDTO));

    }

    /**
     * Create a new user
     * @param user UserCreateRequest
     * @return UserDTO
     */
    @PostMapping()
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserCreateRequest user) {
        return new ResponseEntity<>(UserMapper.toUserDTO(userServiceImpl.create(user)),HttpStatus.CREATED);
    }

    /**
     *
     * @param id User id
     * @return UserDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(UserMapper.toUserDTO(userServiceImpl.findById(id)));
    }


    /**
     * Get a user by phone
     * @param phone String
     * @return UserDTO
     */
    @GetMapping("/find-by-phone/{phone}")
    public ResponseEntity<UserDTO> getUserByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(UserMapper.toUserDTO(userServiceImpl.findByPhone(phone)));
    }


    /**
     * Update a user
     * @param user UserUpdateRequest
     * @return UserDTO
     */
    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody @Valid UserUpdateRequest user) {
        return ResponseEntity.ok(UserMapper.toUserDTO(userServiceImpl.update(user,id)));
    }


    /**
     * Delete a user
     * @param id User id
     * @return ResponseEntity<Void>
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userServiceImpl.delete(id);
        return ResponseEntity.noContent().build();
    }



    /**
     * Restore a user
     * @param id User id
     * @return ResponseEntity<Void>
     */
    @PatchMapping("/{id}/restore")
    public ResponseEntity<ResultResponse> restoreUser(@PathVariable UUID id) {
        ResultResponse result = userServiceImpl.restore(id);
        return ResponseEntity.status(result.status()).body(result);
    }
}
