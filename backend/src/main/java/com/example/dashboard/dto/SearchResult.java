package com.example.dashboard.dto;

import com.example.dashboard.domain.Customer;
import com.example.dashboard.domain.Order;
import java.util.List;

public record SearchResult(List<Order> orders, List<Customer> customers) {
}
