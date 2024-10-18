package com.taxiapp.api.controller.test;

import com.taxiapp.api.controller.user.dto.UserDTO;
import com.taxiapp.api.model.Role;
import com.taxiapp.api.model.Vehicle;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.repository.VehicleRepository;
import com.taxiapp.api.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class WebSocketTestController {


    private final RoleRepository roleRepository;

    @MessageMapping("/vehicles")
    @SendTo("/topic/greetings")
    public List<Role> greeting(String message) throws Exception {
        return  roleRepository.findAll();
    }

}
