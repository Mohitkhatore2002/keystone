package com.meridian.keystone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartUsageDto {
    private Long id;
    private Long workOrderId;
    private Long partId;
    private String partName;
    private String partSku;
    private BigDecimal unitCost;
    private Integer qtyUsed;
    private BigDecimal totalCost;
    private LocalDateTime createdAt;
}
