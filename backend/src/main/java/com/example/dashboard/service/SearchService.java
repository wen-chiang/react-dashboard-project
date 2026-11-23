package com.example.dashboard.service;

import com.example.dashboard.domain.Customer;
import com.example.dashboard.domain.Order;
import com.example.dashboard.dto.SearchResult;
import com.example.dashboard.repository.CustomerRepository;
import com.example.dashboard.repository.OrderRepository;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Backs both the navbar search page and /api/search - kept as one place so
 * the GUI and REST results never drift apart.
 */
@Service
@RequiredArgsConstructor
public class SearchService {

    private static final int MAX_RESULTS = 20;

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    public SearchResult search(String query) {
        String needle = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        if (needle.isEmpty()) {
            return new SearchResult(List.of(), List.of());
        }

        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getOrderNumber().toLowerCase(Locale.ROOT).contains(needle)
                        || order.getCustomer().getName().toLowerCase(Locale.ROOT).contains(needle))
                .limit(MAX_RESULTS)
                .toList();

        List<Customer> customers = customerRepository.findAll().stream()
                .filter(customer -> customer.getName().toLowerCase(Locale.ROOT).contains(needle)
                        || customer.getEmail().toLowerCase(Locale.ROOT).contains(needle))
                .limit(MAX_RESULTS)
                .toList();

        return new SearchResult(orders, customers);
    }
}
