package com.taxiapp.api.config;

import com.taxiapp.api.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleService roleService;

    public DataInitializer(RoleService roleService) {
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {
        roleService.createRoleIfNotFound("ROLE_USER");
        roleService.createRoleIfNotFound("ROLE_ADMIN");
    }
}
