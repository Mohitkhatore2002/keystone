package com.meridian.keystone.service;

import com.meridian.keystone.domain.WorkOrder;
import com.meridian.keystone.domain.WorkOrderStatus;
import com.meridian.keystone.dto.WorkOrderDto;
import com.meridian.keystone.dto.WorkOrderSummaryReportDto;
import com.meridian.keystone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final WorkOrderRepository workOrderRepository;
    private final WorkOrderService workOrderService;

    @Transactional(readOnly = true)
    public WorkOrderSummaryReportDto getSummaryReport() {
        long total = workOrderRepository.count();
        long newCount = workOrderRepository.countByStatus(WorkOrderStatus.NEW);
        long assignedCount = workOrderRepository.countByStatus(WorkOrderStatus.ASSIGNED);
        long inProgressCount = workOrderRepository.countByStatus(WorkOrderStatus.IN_PROGRESS);
        long onHoldCount = workOrderRepository.countByStatus(WorkOrderStatus.ON_HOLD);
        long completedCount = workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED);
        long closedCount = workOrderRepository.countByStatus(WorkOrderStatus.CLOSED);
        long cancelledCount = workOrderRepository.countByStatus(WorkOrderStatus.CANCELLED);

        LocalDateTime now = LocalDateTime.now();
        long overdueCount = workOrderRepository.countOverdueWorkOrders(now);

        double slaCompliancePercentage = 100.0;
        if (total > 0) {
            slaCompliancePercentage = ((double) (total - overdueCount) / total) * 100.0;
        }

        List<WorkOrder> overdueList = workOrderRepository.findOverdueWorkOrders(now);
        List<WorkOrderDto> overdueDtos = overdueList.stream()
                .map(workOrderService::mapToWorkOrderDto)
                .collect(Collectors.toList());

        return WorkOrderSummaryReportDto.builder()
                .totalWorkOrders(total)
                .newCount(newCount)
                .assignedCount(assignedCount)
                .inProgressCount(inProgressCount)
                .onHoldCount(onHoldCount)
                .completedCount(completedCount)
                .closedCount(closedCount)
                .cancelledCount(cancelledCount)
                .overdueCount(overdueCount)
                .slaCompliancePercentage(Math.round(slaCompliancePercentage * 10.0) / 10.0)
                .overdueWorkOrders(overdueDtos)
                .build();
    }
}
