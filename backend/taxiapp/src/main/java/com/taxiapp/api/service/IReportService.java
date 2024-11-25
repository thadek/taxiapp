package com.taxiapp.api.service;

import com.taxiapp.api.controller.rest.report.dto.ReportCreateRequest;
import com.taxiapp.api.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IReportService {

    public Report create(ReportCreateRequest report);
    public Report findByRideId(String id);
    public Page<Report> findAll(Pageable pageable);
    public void delete(UUID id);

}