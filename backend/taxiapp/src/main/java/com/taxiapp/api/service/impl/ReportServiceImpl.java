package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.rest.report.dto.ReportCreateRequest;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.model.Report;
import com.taxiapp.api.model.Ride;
import com.taxiapp.api.repository.ReportRepository;
import com.taxiapp.api.repository.RideRepository;
import com.taxiapp.api.service.IReportService;
import com.taxiapp.api.utils.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {

    private final ReportRepository reportRepository;
    private final RideRepository rideRepository;

    @Transactional
    @Override
    public Report create(ReportCreateRequest reportRequest) {
        boolean exists = reportRepository.existsByRideId(reportRequest.rideId());
        if(exists){
            throw new DuplicatedEntityException("Report","ride id", reportRequest.rideId());
        }

        Ride ride = rideRepository.findById(reportRequest.rideId())
                .orElseThrow(() -> new EntityNotFoundException("Ride", "id", reportRequest.rideId()));

        Report newReport = Report.builder()
                .title(reportRequest.title())
                .description(reportRequest.description())
                .lastLocation(reportRequest.lastLocation())
                .date(reportRequest.date())
                .ride(ride)
                .build();

        Report savedReport = reportRepository.save(newReport);

        ride.setReport(savedReport);
        rideRepository.save(ride);

        return savedReport;

    }

    @Transactional(readOnly = true)
    @Override
    public Report findByRideId(String rideId) {
        return reportRepository.findByRideId(rideId).orElse(null);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Report> findAll(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Report", "id", id.toString()));
        reportRepository.delete(report);
    }
}