package com.meridian.keystone.dto;

import com.meridian.keystone.domain.WorkOrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusTransitionRequest {
    @NotNull(message = "Target status is required")
    private WorkOrderStatus toStatus;
    private String note;
}
