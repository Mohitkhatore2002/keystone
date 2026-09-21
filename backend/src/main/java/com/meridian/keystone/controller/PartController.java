package com.meridian.keystone.controller;

import com.meridian.keystone.dto.PartDto;
import com.meridian.keystone.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
@Tag(name = "Inventory Parts", description = "Endpoints for managing spare parts inventory")
public class PartController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "List all inventory parts")
    public ResponseEntity<List<PartDto>> getAllParts() {
        return ResponseEntity.ok(inventoryService.getAllParts());
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    @Operation(summary = "Create a new inventory part (Manager only)")
    public ResponseEntity<PartDto> createPart(@Valid @RequestBody PartDto partDto) {
        return new ResponseEntity<>(inventoryService.createPart(partDto), HttpStatus.CREATED);
    }
}
