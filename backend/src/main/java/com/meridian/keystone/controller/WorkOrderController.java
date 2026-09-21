package com.meridian.keystone.controller;

import com.meridian.keystone.domain.WorkOrderPriority;
import com.meridian.keystone.domain.WorkOrderStatus;
import com.meridian.keystone.dto.*;
import com.meridian.keystone.service.InventoryService;
import com.meridian.keystone.service.WorkOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
@Tag(name = "Work Orders", description = "Endpoints for Work Order lifecycle management, dispatching, inventory and time logging")
public class WorkOrderController {

    private final WorkOrderService workOrderService;
    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get paginated and filtered work orders (role-scoped)")
    public ResponseEntity<Page<WorkOrderDto>> getWorkOrders(
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) WorkOrderPriority priority,
            @RequestParam(required = false) Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(workOrderService.getWorkOrders(status, priority, customerId, pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all work orders as a list (role-scoped, for Kanban board rendering)")
    public ResponseEntity<List<WorkOrderDto>> getAllWorkOrdersList() {
        return ResponseEntity.ok(workOrderService.getAllWorkOrdersList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get work order details with full audit history, parts used, and labor time")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    @Operation(summary = "Raise a new work order")
    public ResponseEntity<WorkOrderDto> createWorkOrder(@Valid @RequestBody CreateWorkOrderRequest request) {
        return new ResponseEntity<>(workOrderService.createWorkOrder(request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/assign")
    @Operation(summary = "Assign work order to a technician (Dispatcher / Manager)")
    public ResponseEntity<WorkOrderDto> assignWorkOrder(@PathVariable Long id, @Valid @RequestBody AssignWorkOrderRequest request) {
        return ResponseEntity.ok(workOrderService.assignWorkOrder(id, request));
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "Transition work order status per 7-state lifecycle rules")
    public ResponseEntity<WorkOrderDto> transitionStatus(@PathVariable Long id, @Valid @RequestBody StatusTransitionRequest request) {
        return ResponseEntity.ok(workOrderService.transitionStatus(id, request));
    }

    @PostMapping("/{id}/parts")
    @Operation(summary = "Log part usage against job — transactionally decrements inventory stock")
    public ResponseEntity<PartUsageDto> logPartUsage(@PathVariable Long id, @Valid @RequestBody LogPartUsageRequest request) {
        return new ResponseEntity<>(inventoryService.logPartUsage(id, request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/time")
    @Operation(summary = "Log labor hours/minutes against work order")
    public ResponseEntity<TimeLogDto> logTime(@PathVariable Long id, @Valid @RequestBody LogTimeRequest request) {
        return new ResponseEntity<>(workOrderService.logTime(id, request), HttpStatus.CREATED);
    }
}
