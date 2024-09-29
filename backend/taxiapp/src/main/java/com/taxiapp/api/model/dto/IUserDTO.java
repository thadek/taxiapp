package com.taxiapp.api.model.dto;

import com.taxiapp.api.model.entity.Role;
import com.taxiapp.api.model.entity.User;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Projection(name = "IUserDTO", types = User.class)
public interface IUserDTO {
    UUID getId();
    String getName();
    String getLastname();
    String getUsername();
    String getEmail();
    Set<Role> getRoles();
    Timestamp getIs_disabled();
}
