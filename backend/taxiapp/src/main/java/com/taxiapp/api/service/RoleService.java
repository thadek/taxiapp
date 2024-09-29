package com.taxiapp.api.service;

import com.taxiapp.api.model.entity.Role;
import com.taxiapp.api.repository.RoleRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Data
@AllArgsConstructor
public class RoleService {


    private final RoleRepository roleRepository;

    public void createRoleIfNotFound(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).build());
        }
    }

}
