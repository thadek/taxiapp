package com.taxiapp.api.config;

import com.taxiapp.api.config.security.InternalAuth;
import com.taxiapp.api.service.impl.RoleServiceImpl;
import com.taxiapp.api.service.impl.UserServiceImpl;
import com.taxiapp.api.service.impl.BusinessConfigServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

   private final RoleServiceImpl roleServiceImpl;
   private final UserServiceImpl userServiceImpl;
    private final BusinessConfigServiceImpl businessConfigService;

    public DataInitializer(RoleServiceImpl roleServiceImpl, UserServiceImpl userServiceImpl,BusinessConfigServiceImpl businessConfigService) {
        this.roleServiceImpl = roleServiceImpl;
        this.userServiceImpl = userServiceImpl;
        this.businessConfigService = businessConfigService;
    }

    @Override
    public void run(String... args) throws Exception {
        InternalAuth.performInternalTask();
        roleServiceImpl.createRoleIfNotFound("ROLE_USER");
        roleServiceImpl.createRoleIfNotFound("ROLE_ADMIN");
        roleServiceImpl.createRoleIfNotFound("ROLE_DRIVER");
        roleServiceImpl.createRoleIfNotFound("ROLE_OPERATOR");
        userServiceImpl.createDefaultAdminUserIfNotFound();
        businessConfigService.loadDefaultConfig();
    }


}
