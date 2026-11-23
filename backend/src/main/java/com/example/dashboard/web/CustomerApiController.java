package com.example.dashboard.web;

import com.example.dashboard.domain.Customer;
import com.example.dashboard.dto.CustomerFormRequest;
import com.example.dashboard.exception.CustomerNotFoundException;
import com.example.dashboard.repository.CustomerRepository;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * JSON API for customer CRUD operations.
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerApiController {

    private final CustomerRepository customerRepository;

    /**
     * Get all customers
     */
    @GetMapping
    public List<Customer> list() {
        return customerRepository.findAll();
    }

    /**
     * Get a single customer by ID
     */
    @GetMapping("/{id}")
    public Customer getById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    /**
     * Create a new customer
     */
    @PostMapping
    public ResponseEntity<Customer> create(@Valid @RequestBody CustomerFormRequest form) {
        Customer saved = customerRepository.save(Customer.builder()
                .name(form.getName())
                .email(form.getEmail())
                .initials(form.getInitials())
                .build());
        return ResponseEntity.created(URI.create("/api/customers/" + saved.getId())).body(saved);
    }

    /**
     * Update an existing customer
     */
    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @Valid @RequestBody CustomerFormRequest form) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        
        customer.setName(form.getName());
        customer.setEmail(form.getEmail());
        customer.setInitials(form.getInitials());
        
        return customerRepository.save(customer);
    }

    /**
     * Delete a customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
        customerRepository.delete(customer);
        return ResponseEntity.noContent().build();
    }
}

