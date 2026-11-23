package com.example.dashboard.service;

import com.example.dashboard.dto.PipelineStepDetail;
import com.example.dashboard.exception.PipelineStepNotFoundException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Reference data for the /orders/pipeline demo. Static (not backed by real
 * order state) since the pipeline page itself is a UI pattern example, but
 * served from a real endpoint rather than hardcoded in the page's JS so the
 * detail panel is a genuine server round trip.
 */
@Service
public class PipelineStepService {

    private final Map<String, PipelineStepDetail> steps = new LinkedHashMap<>();

    public PipelineStepService() {
        steps.put("1", new PipelineStepDetail("1", "Order Placed",
                "Customer submits the order and payment is authorized.", "Instant"));
        steps.put("2a", new PipelineStepDetail("2a", "Inventory Check",
                "Warehouse confirms stock is available for every line item on the order.", "~15 minutes"));
        steps.put("2b", new PipelineStepDetail("2b", "Payment Verification",
                "Finance confirms the charge cleared with the payment processor.", "~5 minutes"));
        steps.put("3", new PipelineStepDetail("3", "Ready to Ship",
                "Both the inventory and payment checks passed, so the order is picked and packed.", "~1 hour"));
        steps.put("4", new PipelineStepDetail("4", "Shipped",
                "Package is handed to the carrier and a tracking number is issued.", "1-2 business days in transit"));
        steps.put("5", new PipelineStepDetail("5", "Delivered",
                "Customer receives the package and the order is marked complete.", "N/A"));
    }

    public PipelineStepDetail find(String id) {
        PipelineStepDetail step = steps.get(id);
        if (step == null) {
            throw new PipelineStepNotFoundException(id);
        }
        return step;
    }
}
