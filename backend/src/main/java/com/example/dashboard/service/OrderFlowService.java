package com.example.dashboard.service;

import com.example.dashboard.dto.OrderFlowElementDetail;
import com.example.dashboard.dto.OrderFlowStatusResponse;
import com.example.dashboard.exception.OrderFlowElementNotFoundException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Maps the demo process diagram (static/bpmn/order-fulfillment.bpmn) to a
 * per-element status for a given step, so /orders/flow can color the live
 * bpmn-js rendering instead of baking status into the diagram file itself.
 * Mirrors the same 5-step flow as the hand-rolled /orders/pipeline demo -
 * same order lifecycle, different rendering technique.
 */
@Service
public class OrderFlowService {

    public static final int TOTAL_STEPS = 5;

    private static final Map<String, Integer> ELEMENT_STEP = new LinkedHashMap<>();

    static {
        ELEMENT_STEP.put("StartEvent_OrderPlaced", 1);
        ELEMENT_STEP.put("Flow_1", 2);
        ELEMENT_STEP.put("Gateway_Fork", 2);
        ELEMENT_STEP.put("Flow_2a", 2);
        ELEMENT_STEP.put("Flow_2b", 2);
        ELEMENT_STEP.put("Task_InventoryCheck", 2);
        ELEMENT_STEP.put("Task_PaymentVerification", 2);
        ELEMENT_STEP.put("Flow_3a", 2);
        ELEMENT_STEP.put("Flow_3b", 2);
        ELEMENT_STEP.put("Gateway_Join", 2);
        ELEMENT_STEP.put("Flow_4", 3);
        ELEMENT_STEP.put("Task_ReadyToShip", 3);
        ELEMENT_STEP.put("Flow_5", 4);
        ELEMENT_STEP.put("Task_Shipped", 4);
        ELEMENT_STEP.put("Flow_6", 5);
        ELEMENT_STEP.put("EndEvent_Delivered", 5);
    }

    private static final Map<String, OrderFlowElementDetail> ELEMENT_DETAIL = new LinkedHashMap<>();

    static {
        ELEMENT_DETAIL.put("StartEvent_OrderPlaced", new OrderFlowElementDetail("StartEvent_OrderPlaced",
                "Order Placed", "Customer submits the order and payment is authorized.", "Instant"));
        ELEMENT_DETAIL.put("Gateway_Fork", new OrderFlowElementDetail("Gateway_Fork",
                "Split", "Inventory and payment checks run in parallel from here.", "Instant"));
        ELEMENT_DETAIL.put("Task_InventoryCheck", new OrderFlowElementDetail("Task_InventoryCheck",
                "Inventory Check", "Warehouse confirms stock is available for every line item on the order.", "~15 minutes"));
        ELEMENT_DETAIL.put("Task_PaymentVerification", new OrderFlowElementDetail("Task_PaymentVerification",
                "Payment Verification", "Finance confirms the charge cleared with the payment processor.", "~5 minutes"));
        ELEMENT_DETAIL.put("Gateway_Join", new OrderFlowElementDetail("Gateway_Join",
                "Join", "Waits for both the inventory and payment branches to complete.", "Instant"));
        ELEMENT_DETAIL.put("Task_ReadyToShip", new OrderFlowElementDetail("Task_ReadyToShip",
                "Ready to Ship", "Both checks passed, so the order is picked and packed.", "~1 hour"));
        ELEMENT_DETAIL.put("Task_Shipped", new OrderFlowElementDetail("Task_Shipped",
                "Shipped", "Package is handed to the carrier and a tracking number is issued.", "1-2 business days in transit"));
        ELEMENT_DETAIL.put("EndEvent_Delivered", new OrderFlowElementDetail("EndEvent_Delivered",
                "Delivered", "Customer receives the package and the order is marked complete.", "N/A"));
    }

    public OrderFlowElementDetail detailFor(String elementId) {
        OrderFlowElementDetail detail = ELEMENT_DETAIL.get(elementId);
        if (detail == null) {
            throw new OrderFlowElementNotFoundException(elementId);
        }
        return detail;
    }

    public OrderFlowStatusResponse statusFor(int currentStep) {
        int clamped = Math.max(1, Math.min(currentStep, TOTAL_STEPS));
        Map<String, String> statuses = new LinkedHashMap<>();
        ELEMENT_STEP.forEach((elementId, step) -> {
            String state;
            if (step < clamped) {
                state = "COMPLETED";
            } else if (step == clamped) {
                state = "ACTIVE";
            } else {
                state = "PENDING";
            }
            statuses.put(elementId, state);
        });
        return new OrderFlowStatusResponse(clamped, TOTAL_STEPS, statuses);
    }
}
