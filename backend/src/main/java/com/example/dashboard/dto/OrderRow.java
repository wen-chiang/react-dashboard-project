package com.example.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OrderRow(
        String orderNumber,
        String customerName,
        String customerInitials,
        LocalDate orderDate,
        BigDecimal amount,
        String status) {
}
