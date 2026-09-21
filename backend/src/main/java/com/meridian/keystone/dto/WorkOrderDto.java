package com.meridian.keystone.dto;

import com.meridian.keystone.domain.WorkOrderPriority;
import com.meridian.keystone.domain.WorkOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private WorkOrderPriority priority;
    private WorkOrderStatus status;
    private LocalDateTime slaDueAt;
    private boolean isOverdue;

    private Long customerId;
    private String customerName;

    private Long siteId;
    private String siteName;
    private String siteAddress;

    private Long assignedToId;
    private String assignedToName;

    private Long createdById;
    private String createdByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<WorkOrderStatusHistoryDto> history;
    private List<PartUsageDto> partUsages;
    private List<TimeLogDto> timeLogs;
}
