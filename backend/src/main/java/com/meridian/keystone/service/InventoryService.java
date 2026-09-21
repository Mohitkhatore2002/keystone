package com.meridian.keystone.service;

import com.meridian.keystone.domain.Part;
import com.meridian.keystone.domain.PartUsage;
import com.meridian.keystone.domain.WorkOrder;
import com.meridian.keystone.dto.LogPartUsageRequest;
import com.meridian.keystone.dto.PartDto;
import com.meridian.keystone.dto.PartUsageDto;
import com.meridian.keystone.exception.InsufficientStockException;
import com.meridian.keystone.exception.ResourceNotFoundException;
import com.meridian.keystone.repository.PartRepository;
import com.meridian.keystone.repository.PartUsageRepository;
import com.meridian.keystone.repository.WorkOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final PartRepository partRepository;
    private final PartUsageRepository partUsageRepository;
    private final WorkOrderRepository workOrderRepository;

    @Transactional(readOnly = true)
    public List<PartDto> getAllParts() {
        return partRepository.findAll().stream()
                .map(this::mapToPartDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PartDto createPart(PartDto dto) {
        Part part = Part.builder()
                .name(dto.getName())
                .sku(dto.getSku())
                .unitCost(dto.getUnitCost())
                .stockQty(dto.getStockQty() != null ? dto.getStockQty() : 0)
                .build();
        return mapToPartDto(partRepository.save(part));
    }

    @Transactional
    public PartUsageDto logPartUsage(Long workOrderId, LogPartUsageRequest request) {
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + workOrderId));

        Part part = partRepository.findById(request.getPartId())
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + request.getPartId()));

        if (part.getStockQty() < request.getQtyUsed()) {
            throw new InsufficientStockException("Insufficient stock for part '" + part.getName() + "'. Available: "
                    + part.getStockQty() + ", Requested: " + request.getQtyUsed());
        }

        // Transactional decrement
        part.setStockQty(part.getStockQty() - request.getQtyUsed());
        partRepository.save(part);

        PartUsage usage = PartUsage.builder()
                .workOrder(workOrder)
                .part(part)
                .qtyUsed(request.getQtyUsed())
                .build();

        PartUsage saved = partUsageRepository.save(usage);
        return mapToPartUsageDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PartUsageDto> getPartUsagesByWorkOrder(Long workOrderId) {
        return partUsageRepository.findByWorkOrderId(workOrderId).stream()
                .map(this::mapToPartUsageDto)
                .collect(Collectors.toList());
    }

    public PartDto mapToPartDto(Part part) {
        return PartDto.builder()
                .id(part.getId())
                .name(part.getName())
                .sku(part.getSku())
                .unitCost(part.getUnitCost())
                .stockQty(part.getStockQty())
                .build();
    }

    public PartUsageDto mapToPartUsageDto(PartUsage usage) {
        BigDecimal totalCost = usage.getPart().getUnitCost().multiply(BigDecimal.valueOf(usage.getQtyUsed()));
        return PartUsageDto.builder()
                .id(usage.getId())
                .workOrderId(usage.getWorkOrder().getId())
                .partId(usage.getPart().getId())
                .partName(usage.getPart().getName())
                .partSku(usage.getPart().getSku())
                .unitCost(usage.getPart().getUnitCost())
                .qtyUsed(usage.getQtyUsed())
                .totalCost(totalCost)
                .createdAt(usage.getCreatedAt())
                .build();
    }
}
