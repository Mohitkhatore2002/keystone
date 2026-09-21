package com.meridian.keystone.repository;

import com.meridian.keystone.domain.WorkOrder;
import com.meridian.keystone.domain.WorkOrderPriority;
import com.meridian.keystone.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long>, JpaSpecificationExecutor<WorkOrder> {

    Optional<WorkOrder> findByCode(String code);

    Page<WorkOrder> findByCustomerId(Long customerId, Pageable pageable);

    List<WorkOrder> findByCustomerId(Long customerId);

    Page<WorkOrder> findByAssignedToId(Long technicianId, Pageable pageable);

    List<WorkOrder> findByAssignedToId(Long technicianId);

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    @Query("SELECT w FROM WorkOrder w WHERE (:customerId IS NULL OR w.customer.id = :customerId) AND (:status IS NULL OR w.status = :status) AND (:priority IS NULL OR w.priority = :priority)")
    Page<WorkOrder> filterWorkOrders(
            @Param("customerId") Long customerId,
            @Param("status") WorkOrderStatus status,
            @Param("priority") WorkOrderPriority priority,
            Pageable pageable
    );

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.status = :status")
    long countByStatus(@Param("status") WorkOrderStatus status);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.slaDueAt < :now AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED')")
    long countOverdueWorkOrders(@Param("now") LocalDateTime now);

    @Query("SELECT w FROM WorkOrder w WHERE w.slaDueAt < :now AND w.status NOT IN ('COMPLETED', 'CLOSED', 'CANCELLED') ORDER BY w.slaDueAt ASC")
    List<WorkOrder> findOverdueWorkOrders(@Param("now") LocalDateTime now);
}
