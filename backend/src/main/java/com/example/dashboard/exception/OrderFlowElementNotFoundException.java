package com.example.dashboard.exception;

public class OrderFlowElementNotFoundException extends RuntimeException {

    public OrderFlowElementNotFoundException(String id) {
        super("No order flow element found with id: " + id);
    }
}
