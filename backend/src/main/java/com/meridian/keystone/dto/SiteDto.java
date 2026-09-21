package com.meridian.keystone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String name;
    private String address;
    private LocalDateTime createdAt;
}
