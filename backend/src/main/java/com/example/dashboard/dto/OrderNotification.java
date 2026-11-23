package com.example.dashboard.dto;

/**
 * Payload broadcast over the /topic/orders WebSocket topic whenever an order
 * is created or updated, so every open browser tab can show a live toast.
 */
public record OrderNotification(String message, String url) {
}
