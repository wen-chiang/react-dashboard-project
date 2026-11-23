package com.example.dashboard.repository;

import com.example.dashboard.domain.Order;
import com.example.dashboard.domain.OrderStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findTop5ByOrderByOrderDateDesc();

    long countByStatus(OrderStatus status);
}
