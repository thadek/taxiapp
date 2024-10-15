package com.taxiapp.api.config;

import com.taxiapp.api.config.security.InternalAuth;
import com.taxiapp.api.service.impl.RoleServiceImpl;
import com.taxiapp.api.service.impl.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

   private final RoleServiceImpl roleServiceImpl;
   private final UserServiceImpl userServiceImpl;

    public DataInitializer(RoleServiceImpl roleServiceImpl, UserServiceImpl userServiceImpl) {
        this.roleServiceImpl = roleServiceImpl;
        this.userServiceImpl = userServiceImpl;
    }

    @Override
    public void run(String... args) throws Exception {
        InternalAuth.performInternalTask();
        roleServiceImpl.createRoleIfNotFound("ROLE_USER");
        roleServiceImpl.createRoleIfNotFound("ROLE_ADMIN");
        roleServiceImpl.createRoleIfNotFound("ROLE_DRIVER");
        roleServiceImpl.createRoleIfNotFound("ROLE_OPERATOR");
        userServiceImpl.createDefaultAdminUserIfNotFound();

    }


}
