package com.taxiapp.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.taxiapp.api.model.Coordenada;

@Controller
@RequestMapping("/taxi")
public class CoordenadaController {
    private final SimpMessagingTemplate template;

    @Autowired
    public CoordenadaController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/send-coordenada")
    public void sendCoordenada(@RequestBody Coordenada coordenada) {
        this.template.convertAndSend("/taxi/coordenada", coordenada);
    }
}