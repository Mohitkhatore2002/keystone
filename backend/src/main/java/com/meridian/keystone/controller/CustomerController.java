package com.meridian.keystone.controller;

import com.meridian.keystone.dto.CustomerDto;
import com.meridian.keystone.dto.SiteDto;
import com.meridian.keystone.service.CustomerService;
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
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers & Sites", description = "Endpoints for managing client organisations and locations")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "List all customers")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DISPATCHER', 'MANAGER')")
    @Operation(summary = "Create a new customer")
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CustomerDto customerDto) {
        return new ResponseEntity<>(customerService.createCustomer(customerDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/sites")
    @Operation(summary = "Get all sites for a customer")
    public ResponseEntity<List<SiteDto>> getSitesByCustomerId(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getSitesByCustomerId(id));
    }

    @PostMapping("/{id}/sites")
    @PreAuthorize("hasAnyRole('DISPATCHER', 'MANAGER')")
    @Operation(summary = "Add a new site to a customer")
    public ResponseEntity<SiteDto> createSite(@PathVariable Long id, @Valid @RequestBody SiteDto siteDto) {
        return new ResponseEntity<>(customerService.createSite(id, siteDto), HttpStatus.CREATED);
    }
}
