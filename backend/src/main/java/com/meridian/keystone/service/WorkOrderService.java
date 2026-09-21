package com.meridian.keystone.service;

import com.meridian.keystone.domain.*;
import com.meridian.keystone.dto.*;
import com.meridian.keystone.exception.ForbiddenAccessException;
import com.meridian.keystone.exception.IllegalStateTransitionException;
import com.meridian.keystone.exception.ResourceNotFoundException;
import com.meridian.keystone.repository.*;
import com.meridian.keystone.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;
    private final TimeLogRepository timeLogRepository;

    @Transactional(readOnly = true)
    public Page<WorkOrderDto> getWorkOrders(WorkOrderStatus status, WorkOrderPriority priority, Long customerId, Pageable pageable) {
        UserPrincipal currentUser = getCurrentUser();

        if (currentUser.getRole() == UserRole.CUSTOMER) {
            Customer customer = getCustomerForCurrentUser(currentUser);
            return workOrderRepository.findByCustomerId(customer.getId(), pageable).map(this::mapToWorkOrderDto);
        } else if (currentUser.getRole() == UserRole.TECHNICIAN) {
            return workOrderRepository.findByAssignedToId(currentUser.getId(), pageable).map(this::mapToWorkOrderDto);
        }

        return workOrderRepository.filterWorkOrders(customerId, status, priority, pageable).map(this::mapToWorkOrderDto);
    }

    @Transactional(readOnly = true)
    public List<WorkOrderDto> getAllWorkOrdersList() {
        UserPrincipal currentUser = getCurrentUser();

        if (currentUser.getRole() == UserRole.CUSTOMER) {
            Customer customer = getCustomerForCurrentUser(currentUser);
            return workOrderRepository.findByCustomerId(customer.getId()).stream().map(this::mapToWorkOrderDto).collect(Collectors.toList());
        } else if (currentUser.getRole() == UserRole.TECHNICIAN) {
            return workOrderRepository.findByAssignedToId(currentUser.getId()).stream().map(this::mapToWorkOrderDto).collect(Collectors.toList());
        }

        return workOrderRepository.findAll().stream().map(this::mapToWorkOrderDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkOrderDto getWorkOrderById(Long id) {
        WorkOrder workOrder = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + id));

        UserPrincipal currentUser = getCurrentUser();
        validateReadAccess(workOrder, currentUser);

        return mapToWorkOrderDto(workOrder);
    }

    @Transactional
    public WorkOrderDto createWorkOrder(CreateWorkOrderRequest request) {
        UserPrincipal currentUser = getCurrentUser();

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        Site site = siteRepository.findById(request.getSiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with id: " + request.getSiteId()));

        // Customer security check: customers can only raise work orders for their own sites
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            Customer userCustomer = getCustomerForCurrentUser(currentUser);
            if (!userCustomer.getId().equals(customer.getId())) {
                throw new ForbiddenAccessException("Cannot create work order for another customer");
            }
        }

        User creator = userRepository.findById(currentUser.getId()).orElse(null);
        User assignedTo = null;
        WorkOrderStatus initialStatus = WorkOrderStatus.NEW;

        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned technician not found with id: " + request.getAssignedToId()));
            initialStatus = WorkOrderStatus.ASSIGNED;
        }

        String code = "WO-" + System.currentTimeMillis() % 1000000;

        WorkOrder workOrder = WorkOrder.builder()
                .code(code)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(initialStatus)
                .slaDueAt(request.getSlaDueAt())
                .customer(customer)
                .site(site)
                .assignedTo(assignedTo)
                .createdBy(creator)
                .build();

        WorkOrder saved = workOrderRepository.save(workOrder);

        // Append initial audit log
        WorkOrderStatusHistory initialAudit = WorkOrderStatusHistory.builder()
                .workOrder(saved)
                .fromStatus(null)
                .toStatus(initialStatus)
                .changedBy(currentUser.getEmail())
                .note("Work order raised via platform")
                .build();
        historyRepository.save(initialAudit);

        return mapToWorkOrderDto(saved);
    }

    @Transactional
    public WorkOrderDto assignWorkOrder(Long workOrderId, AssignWorkOrderRequest request) {
        UserPrincipal currentUser = getCurrentUser();
        if (currentUser.getRole() != UserRole.DISPATCHER && currentUser.getRole() != UserRole.MANAGER) {
            throw new ForbiddenAccessException("Only Dispatchers or Managers can assign work orders");
        }

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + workOrderId));

        if (workOrder.getStatus() == WorkOrderStatus.CLOSED || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
            throw new IllegalStateTransitionException("Cannot assign a terminal work order in status: " + workOrder.getStatus());
        }

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + request.getTechnicianId()));

        if (technician.getRole() != UserRole.TECHNICIAN) {
            throw new IllegalArgumentException("User " + technician.getName() + " is not a Technician");
        }

        WorkOrderStatus oldStatus = workOrder.getStatus();
        workOrder.setAssignedTo(technician);

        if (oldStatus == WorkOrderStatus.NEW) {
            workOrder.setStatus(WorkOrderStatus.ASSIGNED);
            recordStatusChange(workOrder, oldStatus, WorkOrderStatus.ASSIGNED, currentUser.getEmail(), "Assigned to technician " + technician.getName());
        } else {
            recordStatusChange(workOrder, oldStatus, oldStatus, currentUser.getEmail(), "Reassigned to technician " + technician.getName());
        }

        return mapToWorkOrderDto(workOrderRepository.save(workOrder));
    }

    @Transactional
    public WorkOrderDto transitionStatus(Long workOrderId, StatusTransitionRequest request) {
        UserPrincipal currentUser = getCurrentUser();
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + workOrderId));

        WorkOrderStatus currentStatus = workOrder.getStatus();
        WorkOrderStatus targetStatus = request.getToStatus();

        validateTransitionRules(currentStatus, targetStatus, currentUser, workOrder);

        workOrder.setStatus(targetStatus);

        if (targetStatus == WorkOrderStatus.ASSIGNED && workOrder.getAssignedTo() == null) {
            throw new IllegalStateTransitionException("Cannot transition to ASSIGNED without an assigned technician");
        }

        recordStatusChange(workOrder, currentStatus, targetStatus, currentUser.getEmail(), request.getNote());

        return mapToWorkOrderDto(workOrderRepository.save(workOrder));
    }

    @Transactional
    public TimeLogDto logTime(Long workOrderId, LogTimeRequest request) {
        UserPrincipal currentUser = getCurrentUser();
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + workOrderId));

        User technician = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TimeLog timeLog = TimeLog.builder()
                .workOrder(workOrder)
                .technician(technician)
                .minutes(request.getMinutes())
                .note(request.getNote())
                .build();

        TimeLog saved = timeLogRepository.save(timeLog);

        return TimeLogDto.builder()
                .id(saved.getId())
                .workOrderId(workOrder.getId())
                .technicianId(technician.getId())
                .technicianName(technician.getName())
                .minutes(saved.getMinutes())
                .note(saved.getNote())
                .loggedAt(saved.getLoggedAt())
                .build();
    }

    private void validateTransitionRules(WorkOrderStatus from, WorkOrderStatus to, UserPrincipal user, WorkOrder wo) {
        if (from == WorkOrderStatus.CLOSED || from == WorkOrderStatus.CANCELLED) {
            throw new IllegalStateTransitionException("Cannot transition from terminal state " + from);
        }

        if (from == to) {
            throw new IllegalStateTransitionException("Work order is already in status " + from);
        }

        boolean validTransition = switch (from) {
            case NEW -> (to == WorkOrderStatus.ASSIGNED || to == WorkOrderStatus.CANCELLED);
            case ASSIGNED -> (to == WorkOrderStatus.IN_PROGRESS || to == WorkOrderStatus.CANCELLED);
            case IN_PROGRESS -> (to == WorkOrderStatus.ON_HOLD || to == WorkOrderStatus.COMPLETED || to == WorkOrderStatus.CANCELLED);
            case ON_HOLD -> (to == WorkOrderStatus.IN_PROGRESS || to == WorkOrderStatus.CANCELLED);
            case COMPLETED -> (to == WorkOrderStatus.CLOSED);
            default -> false;
        };

        if (!validTransition) {
            throw new IllegalStateTransitionException("Illegal status transition from " + from + " to " + to);
        }

        UserRole role = user.getRole();
        if (to == WorkOrderStatus.CLOSED) {
            if (role != UserRole.MANAGER) {
                throw new ForbiddenAccessException("Only Managers can CLOSE a work order");
            }
        } else if (to == WorkOrderStatus.IN_PROGRESS || to == WorkOrderStatus.ON_HOLD || to == WorkOrderStatus.COMPLETED) {
            if (role == UserRole.TECHNICIAN) {
                if (wo.getAssignedTo() == null || !wo.getAssignedTo().getId().equals(user.getId())) {
                    throw new ForbiddenAccessException("Technicians can only update jobs assigned to them");
                }
            } else if (role != UserRole.MANAGER && role != UserRole.DISPATCHER) {
                throw new ForbiddenAccessException("User role " + role + " cannot update job status");
            }
        } else if (to == WorkOrderStatus.CANCELLED) {
            if (role == UserRole.CUSTOMER) {
                Customer customer = getCustomerForCurrentUser(user);
                if (!wo.getCustomer().getId().equals(customer.getId()) || from != WorkOrderStatus.NEW) {
                    throw new ForbiddenAccessException("Customers can only cancel their own unassigned NEW work orders");
                }
            }
        }
    }

    private void recordStatusChange(WorkOrder wo, WorkOrderStatus from, WorkOrderStatus to, String changedBy, String note) {
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
                .workOrder(wo)
                .fromStatus(from)
                .toStatus(to)
                .changedBy(changedBy)
                .note(note)
                .build();
        historyRepository.save(history);
    }

    private void validateReadAccess(WorkOrder workOrder, UserPrincipal user) {
        if (user.getRole() == UserRole.CUSTOMER) {
            Customer customer = getCustomerForCurrentUser(user);
            if (!workOrder.getCustomer().getId().equals(customer.getId())) {
                throw new ForbiddenAccessException("Access denied: Customer cannot access work order belonging to another organization");
            }
        } else if (user.getRole() == UserRole.TECHNICIAN) {
            if (workOrder.getAssignedTo() == null || !workOrder.getAssignedTo().getId().equals(user.getId())) {
                throw new ForbiddenAccessException("Access denied: Technician can only view assigned work orders");
            }
        }
    }

    private Customer getCustomerForCurrentUser(UserPrincipal user) {
        return customerRepository.findByContactEmail(user.getEmail())
                .orElseGet(() -> customerRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Customer account not associated")));
    }

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            throw new ForbiddenAccessException("User is not authenticated");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    public WorkOrderDto mapToWorkOrderDto(WorkOrder wo) {
        boolean isOverdue = wo.getSlaDueAt() != null && wo.getSlaDueAt().isBefore(LocalDateTime.now())
                && wo.getStatus() != WorkOrderStatus.COMPLETED && wo.getStatus() != WorkOrderStatus.CLOSED && wo.getStatus() != WorkOrderStatus.CANCELLED;

        List<WorkOrderStatusHistoryDto> historyDtos = wo.getStatusHistory() != null
                ? wo.getStatusHistory().stream().map(h -> WorkOrderStatusHistoryDto.builder()
                .id(h.getId())
                .fromStatus(h.getFromStatus())
                .toStatus(h.getToStatus())
                .changedBy(h.getChangedBy())
                .changedAt(h.getChangedAt())
                .note(h.getNote())
                .build()).collect(Collectors.toList())
                : List.of();

        List<PartUsageDto> partDtos = wo.getPartUsages() != null
                ? wo.getPartUsages().stream().map(p -> PartUsageDto.builder()
                .id(p.getId())
                .workOrderId(wo.getId())
                .partId(p.getPart().getId())
                .partName(p.getPart().getName())
                .partSku(p.getPart().getSku())
                .unitCost(p.getPart().getUnitCost())
                .qtyUsed(p.getQtyUsed())
                .totalCost(p.getPart().getUnitCost().multiply(java.math.BigDecimal.valueOf(p.getQtyUsed())))
                .createdAt(p.getCreatedAt())
                .build()).collect(Collectors.toList())
                : List.of();

        List<TimeLogDto> timeDtos = wo.getTimeLogs() != null
                ? wo.getTimeLogs().stream().map(t -> TimeLogDto.builder()
                .id(t.getId())
                .workOrderId(wo.getId())
                .technicianId(t.getTechnician().getId())
                .technicianName(t.getTechnician().getName())
                .minutes(t.getMinutes())
                .note(t.getNote())
                .loggedAt(t.getLoggedAt())
                .build()).collect(Collectors.toList())
                : List.of();

        return WorkOrderDto.builder()
                .id(wo.getId())
                .code(wo.getCode())
                .title(wo.getTitle())
                .description(wo.getDescription())
                .priority(wo.getPriority())
                .status(wo.getStatus())
                .slaDueAt(wo.getSlaDueAt())
                .isOverdue(isOverdue)
                .customerId(wo.getCustomer().getId())
                .customerName(wo.getCustomer().getName())
                .siteId(wo.getSite().getId())
                .siteName(wo.getSite().getName())
                .siteAddress(wo.getSite().getAddress())
                .assignedToId(wo.getAssignedTo() != null ? wo.getAssignedTo().getId() : null)
                .assignedToName(wo.getAssignedTo() != null ? wo.getAssignedTo().getName() : "Unassigned")
                .createdById(wo.getCreatedBy() != null ? wo.getCreatedBy().getId() : null)
                .createdByName(wo.getCreatedBy() != null ? wo.getCreatedBy().getName() : "System")
                .createdAt(wo.getCreatedAt())
                .updatedAt(wo.getUpdatedAt())
                .history(historyDtos)
                .partUsages(partDtos)
                .timeLogs(timeDtos)
                .build();
    }
}
