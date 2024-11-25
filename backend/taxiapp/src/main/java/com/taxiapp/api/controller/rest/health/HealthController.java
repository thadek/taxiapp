package com.taxiapp.api.controller.rest.health;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> checkHealth() {
        return ResponseEntity.ok(new HealthResponse("OK"));
    }
}
