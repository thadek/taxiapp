package com.taxiapp.api.model.dto.impl;

import com.taxiapp.api.model.dto.IUserDTO;
import com.taxiapp.api.model.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDTOImpl{
    private String id;
    private String name;
    private String lastname;
    private String username;
    private String email;
    private Set<Role> roles;
    private String is_disabled;

}
