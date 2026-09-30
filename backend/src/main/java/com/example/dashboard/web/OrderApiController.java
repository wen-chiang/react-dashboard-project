package com.example.dashboard.web;

import com.example.dashboard.domain.Order;
import com.example.dashboard.dto.OrderFormRequest;
import com.example.dashboard.exception.OrderNotFoundException;
import com.example.dashboard.repository.OrderRepository;
import com.example.dashboard.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderApiController {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    /**
     * Get all orders with pagination
     */
    @GetMapping
    public Page<Order> list(@RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "" + DEFAULT_PAGE_SIZE) int size) {
        return orderService.listPage(page, size);
    }

    /**
     * Get a single order by ID
     */
    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    /**
     * Create a new order
     */
    @PostMapping
    public ResponseEntity<Order> create(@Valid @RequestBody OrderFormRequest form) {
        Order created = orderService.create(form);
        return ResponseEntity
                .created(URI.create("/api/orders/" + created.getId()))
                .body(created);
    }

    /**
     * Update an existing order
     */
    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @Valid @RequestBody OrderFormRequest form) {
        return orderService.update(id, form);
    }

    /**
     * Delete an order
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        orderRepository.delete(order);
        return ResponseEntity.noContent().build();
    }
}
