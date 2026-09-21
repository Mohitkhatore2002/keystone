package com.meridian.keystone.dto;

import com.meridian.keystone.domain.WorkOrderPriority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateWorkOrderRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private WorkOrderPriority priority;

    @NotNull(message = "SLA due date is required")
    @Future(message = "SLA due date must be in the future")
    private LocalDateTime slaDueAt;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Site ID is required")
    private Long siteId;

    private Long assignedToId;
}
