package com.taxiapp.api.controller.rest.fcm;

import com.taxiapp.api.service.IUserService;
import com.taxiapp.api.controller.rest.fcm.dto.FCMTokenRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fcm")
public class FCMTokenController {

    private final IUserService userService;

    public FCMTokenController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/store-fcm-token")
    public ResponseEntity<?> storeFcmToken(@RequestBody FCMTokenRequest request) {
        userService.updateFcmToken(request.getEmail(), request.getFcmToken());
        return ResponseEntity.ok("Token stored successfully");
    }
}