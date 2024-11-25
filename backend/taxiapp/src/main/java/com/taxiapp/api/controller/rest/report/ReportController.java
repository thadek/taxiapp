package com.taxiapp.api.controller.rest.report;

import com.taxiapp.api.controller.rest.report.dto.ReportCreateRequest;
import com.taxiapp.api.controller.rest.report.dto.ReportDTO;
import com.taxiapp.api.model.Report;
import com.taxiapp.api.service.IReportService;
import com.taxiapp.api.service.impl.ReportServiceImpl;
import com.taxiapp.api.utils.ResultResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_OPERATOR')")
public class ReportController {

    private final ReportServiceImpl reportServiceImpl;
    private final ModelMapper modelMapper;

    @GetMapping
    public PagedModel<ReportDTO> getAllReports(@PageableDefault Pageable pageable) {
        Page<Report> reports = reportServiceImpl.findAll(pageable);
        return new PagedModel<>(reports.map(report -> modelMapper.map(report, ReportDTO.class)));
    }

    @PostMapping()
    public ResponseEntity<Report> createReport(@RequestBody @Valid ReportCreateRequest report) {
        return new ResponseEntity<>(reportServiceImpl.create(report), HttpStatus.CREATED);
    }

    @GetMapping("/ride/{id}")
    public ResponseEntity<ReportDTO> getReportByRideId(@PathVariable String id) {
        Report report = reportServiceImpl.findByRideId(id);
        return new ResponseEntity<>(modelMapper.map(report, ReportDTO.class), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        reportServiceImpl.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}