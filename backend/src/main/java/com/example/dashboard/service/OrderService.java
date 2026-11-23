package com.example.dashboard.service;

import com.example.dashboard.domain.Order;
import com.example.dashboard.dto.OrderFormRequest;
import org.springframework.data.domain.Page;

public interface OrderService {

    Page<Order> listPage(int page, int size);

    Order create(OrderFormRequest form);

    Order update(Long id, OrderFormRequest form);
}
