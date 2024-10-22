package com.taxiapp.api.controller;

import com.taxiapp.api.model.Coordenada;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/taxi")
public class TaxiController {
    private final SimpMessagingTemplate template;

    @Autowired
    public TaxiController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/send-taxi-coordenada")
    public void sendCoordenada(@RequestBody Coordenada coordenada) {
        this.template.convertAndSend("/taxi/coordenada", coordenada);
    }
}