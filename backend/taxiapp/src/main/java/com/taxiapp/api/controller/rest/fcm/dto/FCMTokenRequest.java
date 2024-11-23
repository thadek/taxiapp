package com.taxiapp.api.controller.rest.fcm.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FCMTokenRequest {
    // Getters and setters
    private String email;
    private String fcmToken;

}