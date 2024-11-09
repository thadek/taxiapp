package com.taxiapp.api.controller.test;


import com.taxiapp.api.model.Location;
import com.taxiapp.api.model.Role;
import com.taxiapp.api.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.TextMessage;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class WebSocketTestController {


    @MessageMapping("/location")
    @SendTo("/topic/locations")
    public Location sendCoords(Location coords, Map<String, Object> attributes) throws Exception {
        return coords;
    }

}
