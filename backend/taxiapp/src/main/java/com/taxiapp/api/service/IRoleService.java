package com.taxiapp.api.service;

import com.taxiapp.api.controller.role.RoleCreateRequest;
import com.taxiapp.api.model.Role;
import java.util.List;


public interface IRoleService {
    void createRoleIfNotFound(String name);
    Role create(RoleCreateRequest role);
    Role update(Role role, int id);
    void delete(int id);
    Role findById(int id);
    List<Role> findAll();

}
