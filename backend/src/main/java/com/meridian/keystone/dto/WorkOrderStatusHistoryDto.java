package com.meridian.keystone.dto;

import com.meridian.keystone.domain.WorkOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderStatusHistoryDto {
    private Long id;
    private WorkOrderStatus fromStatus;
    private WorkOrderStatus toStatus;
    private String changedBy;
    private LocalDateTime changedAt;
    private String note;
}
