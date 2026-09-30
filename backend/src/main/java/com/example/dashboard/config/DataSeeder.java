package com.example.dashboard.config;

import com.example.dashboard.domain.Customer;
import com.example.dashboard.domain.Order;
import com.example.dashboard.domain.OrderStatus;
import com.example.dashboard.repository.CustomerRepository;
import com.example.dashboard.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final OrderStatus[] STATUS_WEIGHTS = {
        OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED,
        OrderStatus.PENDING, OrderStatus.CANCELLED
    };

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        List<Customer> customers = customerRepository.saveAll(List.of(
                Customer.builder().name("Ava Thompson").email("ava.thompson@example.com").initials("AT").build(),
                Customer.builder().name("Liam Carter").email("liam.carter@example.com").initials("LC").build(),
                Customer.builder().name("Sophia Nguyen").email("sophia.nguyen@example.com").initials("SN").build(),
                Customer.builder().name("Noah Patel").email("noah.patel@example.com").initials("NP").build(),
                Customer.builder().name("Isabella Ruiz").email("isabella.ruiz@example.com").initials("IR").build(),
                Customer.builder().name("Mason Cole").email("mason.cole@example.com").initials("MC").build()));

        Random random = new Random(42);
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusMonths(6);

        int orderNumber = 1000;
        for (LocalDate date = start; !date.isAfter(today); date = date.plusDays(1)) {
            int ordersToday = random.nextInt(4);
            for (int i = 0; i < ordersToday; i++) {
                Customer customer = customers.get(random.nextInt(customers.size()));
                BigDecimal amount = BigDecimal.valueOf(40 + random.nextInt(460)).setScale(2);
                OrderStatus status = STATUS_WEIGHTS[random.nextInt(STATUS_WEIGHTS.length)];

                orderRepository.save(Order.builder()
                        .orderNumber("ORD-" + (orderNumber++))
                        .customer(customer)
                        .orderDate(date)
                        .amount(amount)
                        .status(status)
                        .build());
            }
        }

        log.info("Seeded {} customers and {} orders", customers.size(), orderRepository.count());
    }
}
