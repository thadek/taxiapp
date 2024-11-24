package com.taxiapp.api.service;

import com.taxiapp.api.controller.rest.role.RoleCreateRequest;
import com.taxiapp.api.entity.Role;
import java.util.List;


public interface IRoleService {
    void createRoleIfNotFound(String name);
    Role create(RoleCreateRequest role);
    Role update(RoleCreateRequest role, int id);
    void delete(int id);
    Role findById(int id);
    List<Role> findAll();


}
