package com.meridian.keystone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderSummaryReportDto {
    private long totalWorkOrders;
    private long newCount;
    private long assignedCount;
    private long inProgressCount;
    private long onHoldCount;
    private long completedCount;
    private long closedCount;
    private long cancelledCount;
    private long overdueCount;
    private double slaCompliancePercentage;

    private List<WorkOrderDto> overdueWorkOrders;
}
