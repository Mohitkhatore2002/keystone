package com.meridian.keystone.service;

import com.meridian.keystone.domain.Customer;
import com.meridian.keystone.domain.Site;
import com.meridian.keystone.dto.CustomerDto;
import com.meridian.keystone.dto.SiteDto;
import com.meridian.keystone.exception.ResourceNotFoundException;
import com.meridian.keystone.repository.CustomerRepository;
import com.meridian.keystone.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToCustomerDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToCustomerDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto) {
        Customer customer = Customer.builder()
                .name(dto.getName())
                .contactEmail(dto.getContactEmail())
                .phone(dto.getPhone())
                .build();
        Customer saved = customerRepository.save(customer);
        return mapToCustomerDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SiteDto> getSitesByCustomerId(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with id: " + customerId);
        }
        return siteRepository.findByCustomerId(customerId).stream()
                .map(this::mapToSiteDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SiteDto createSite(Long customerId, SiteDto dto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Site site = Site.builder()
                .customer(customer)
                .name(dto.getName())
                .address(dto.getAddress())
                .build();
        Site saved = siteRepository.save(site);
        return mapToSiteDto(saved);
    }

    public CustomerDto mapToCustomerDto(Customer customer) {
        List<SiteDto> siteDtos = customer.getSites() != null
                ? customer.getSites().stream().map(this::mapToSiteDto).collect(Collectors.toList())
                : List.of();

        return CustomerDto.builder()
                .id(customer.getId())
                .name(customer.getName())
                .contactEmail(customer.getContactEmail())
                .phone(customer.getPhone())
                .sites(siteDtos)
                .createdAt(customer.getCreatedAt())
                .build();
    }

    public SiteDto mapToSiteDto(Site site) {
        return SiteDto.builder()
                .id(site.getId())
                .customerId(site.getCustomer().getId())
                .customerName(site.getCustomer().getName())
                .name(site.getName())
                .address(site.getAddress())
                .createdAt(site.getCreatedAt())
                .build();
    }
}
