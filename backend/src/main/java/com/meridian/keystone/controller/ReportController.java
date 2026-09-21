package com.meridian.keystone.controller;

import com.meridian.keystone.dto.WorkOrderSummaryReportDto;
import com.meridian.keystone.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics", description = "Endpoints for executive reporting and SLA analytics")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    @Operation(summary = "Get executive dashboard metrics, SLA compliance, and overdue jobs")
    public ResponseEntity<WorkOrderSummaryReportDto> getSummaryReport() {
        return ResponseEntity.ok(reportService.getSummaryReport());
    }
}
