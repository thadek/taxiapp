package com.taxiapp.api.controller.rest.user.mapper;

import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    // Convierte de User a UserDTO
    public static UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .lastname(user.getLastname())
                .username(user.getUsername())
                .phone(user.getPhone())
                .email(user.getEmail())
                .roles(user.getRoles())
                .is_disabled(user.getIs_disabled())
                .build();
    }

    // Convierte una lista de User a una lista de UserDTO
    public static List<UserDTO> toUserDTOList(List<User> users) {
        return users.stream()
                .map(UserMapper::toUserDTO)
                .collect(Collectors.toList());
    }
}