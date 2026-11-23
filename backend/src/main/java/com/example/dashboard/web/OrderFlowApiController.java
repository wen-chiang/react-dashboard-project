package com.example.dashboard.web;

import com.example.dashboard.dto.OrderFlowElementDetail;
import com.example.dashboard.dto.OrderFlowStatusResponse;
import com.example.dashboard.service.OrderFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Backs the live status coloring on /orders/flow - the bpmn-js rendering asks
 * here for which elements are complete/active/pending at a given step.
 */
@RestController
@RequestMapping("/api/orders/flow")
@RequiredArgsConstructor
public class OrderFlowApiController {

    private final OrderFlowService orderFlowService;

    @GetMapping("/status")
    public OrderFlowStatusResponse status(@RequestParam(defaultValue = "1") int currentStep) {
        return orderFlowService.statusFor(currentStep);
    }

    @GetMapping("/elements/{id}")
    public OrderFlowElementDetail element(@PathVariable String id) {
        return orderFlowService.detailFor(id);
    }
}
