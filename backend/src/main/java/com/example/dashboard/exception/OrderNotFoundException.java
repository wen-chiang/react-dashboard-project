package com.example.dashboard.exception;

public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(Long id) {
        super("No order found with id: " + id);
    }
}
