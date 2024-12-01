package com.taxiapp.api.controller.rest.report.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportDTO {
    UUID Id;
    String title;
    String description;
    String lastLocation;
    Date date;
}
