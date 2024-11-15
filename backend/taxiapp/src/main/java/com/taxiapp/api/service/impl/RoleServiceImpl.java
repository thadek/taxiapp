package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.rest.role.RoleCreateRequest;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.model.Role;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.service.IRoleService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Data
@AllArgsConstructor
public class RoleServiceImpl implements IRoleService {


    private final RoleRepository roleRepository;

    public void createRoleIfNotFound(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).build());
        }
    }

    /**
     * Crea un nuevo rol agregando el prefijo ROLE_ al nombre del rol recibido.
     * @param role
     * @return
     */
    @Override
    public Role create(RoleCreateRequest role) {
        String ROLE_PREFIX = "ROLE_";
        String name= ROLE_PREFIX+role.name().toUpperCase();
        //Check if role already exists
        if (roleRepository.findByName(name).isPresent()) {
            throw new DuplicatedEntityException("Role","name",name);
        }
        return roleRepository.save(Role.builder().name(name).build());
    }

    @Override
    public Role update(RoleCreateRequest role, int id) {
        String ROLE_PREFIX = "ROLE_";
        String name= ROLE_PREFIX+role.name().toUpperCase();
        //Check if role already exists
        Role roleUpdate = roleRepository.findById(id).orElse(null);
        if (roleUpdate == null)  {
            throw new EntityNotFoundException("Role","name",name);
        }
        //Chequeo si no existe ese rol previamente
        if(!Objects.equals(roleUpdate.getName(), name) && roleRepository.findByName(name).isPresent()){
            throw new DuplicatedEntityException("Role","name",name);
        }

        roleUpdate.setName(name);
        return roleRepository.save(roleUpdate);
    }

    @Override
    public void delete(int id) {
        //Check if role exists
        if(!roleRepository.existsById(id)){
            throw new EntityNotFoundException("Role","id",String.valueOf(id));
        }
        roleRepository.deleteById(id);
    }

    @Override
    public Role findById(int id) {
        Role role = roleRepository.findById(id).orElse(null);
        if(role == null){
            throw new EntityNotFoundException("Role","id",String.valueOf(id));
        }
        return role;
    }

    @Override
    public List<Role> findAll() {
       return roleRepository.findAll();
    }


}
