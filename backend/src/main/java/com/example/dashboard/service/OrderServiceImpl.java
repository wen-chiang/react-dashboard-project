package com.example.dashboard.service;

import com.example.dashboard.domain.Customer;
import com.example.dashboard.domain.Order;
import com.example.dashboard.dto.OrderFormRequest;
import com.example.dashboard.dto.OrderNotification;
import com.example.dashboard.exception.CustomerNotFoundException;
import com.example.dashboard.exception.OrderNotFoundException;
import com.example.dashboard.repository.CustomerRepository;
import com.example.dashboard.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final String ORDER_NUMBER_PREFIX = "ORD-";
    private static final int ORDER_NUMBER_SEED = 1000;
    private static final String ORDERS_TOPIC = "/topic/orders";

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public Page<Order> listPage(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate")));
    }

    @Override
    @Transactional
    public Order create(OrderFormRequest form) {
        Order order = Order.builder()
                .orderNumber(nextOrderNumber())
                .customer(findCustomer(form.getCustomerId()))
                .orderDate(form.getOrderDate())
                .amount(form.getAmount())
                .status(form.getStatus())
                .build();
        Order saved = orderRepository.save(order);
        notify(saved.getOrderNumber() + " was created for " + saved.getCustomer().getName() + ".");
        return saved;
    }

    @Override
    @Transactional
    public Order update(Long id, OrderFormRequest form) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.setCustomer(findCustomer(form.getCustomerId()));
        order.setOrderDate(form.getOrderDate());
        order.setAmount(form.getAmount());
        order.setStatus(form.getStatus());

        Order saved = orderRepository.save(order);
        notify(saved.getOrderNumber() + " was updated for " + saved.getCustomer().getName() + ".");
        return saved;
    }

    private void notify(String message) {
        messagingTemplate.convertAndSend(ORDERS_TOPIC, new OrderNotification(message, "/orders"));
    }

    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(customerId));
    }

    private String nextOrderNumber() {
        int highest = orderRepository.findAll().stream()
                .map(Order::getOrderNumber)
                .map(number -> number.replace(ORDER_NUMBER_PREFIX, ""))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(ORDER_NUMBER_SEED);
        return ORDER_NUMBER_PREFIX + (highest + 1);
    }
}
