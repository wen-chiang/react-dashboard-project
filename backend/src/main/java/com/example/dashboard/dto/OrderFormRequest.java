package com.example.dashboard.dto;

import com.example.dashboard.domain.OrderStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * Backs the add/edit order modal form. Plain mutable bean (not a record) so
 * Spring MVC can populate it via {@code @ModelAttribute} data binding.
 */
@Data
public class OrderFormRequest {

    @NotNull(message = "Customer is required")
    private Long customerId;

    @NotNull(message = "Order date is required")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate orderDate;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Status is required")
    private OrderStatus status;
}
