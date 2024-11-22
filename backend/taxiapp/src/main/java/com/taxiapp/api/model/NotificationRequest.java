package com.taxiapp.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class NotificationRequest {
    private String title;
    private String body;
    private String topic;
    private String token;
}