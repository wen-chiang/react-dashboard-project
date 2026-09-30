package com.example.dashboard.web;

import com.example.dashboard.dto.OrderFlowAdvanceRequest;
import com.example.dashboard.service.OrderFlowService;
import java.security.Principal;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Handles the "advance" trigger from /orders/flow over STOMP instead of a
 * plain HTTP request/response. ADVANCE_DELAY_SECONDS later (simulating a
 * real backend step taking time) the new status is pushed to the caller's
 * own user queue rather than a broadcast topic - Principal here is the
 * logged-in Spring Security user (SecurityConfig requires auth on /ws/**,
 * so the default WebSocket handshake handler resolves it automatically), so
 * the update reaches every tab logged in as that user, and no one else's.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class OrderFlowSocketController {

    private static final long ADVANCE_DELAY_SECONDS = 15;
    private static final String FLOW_QUEUE = "/queue/orders/flow";

    private final OrderFlowService orderFlowService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ScheduledExecutorService orderFlowScheduler;

    @MessageMapping("/orders/flow/advance")
    public void advance(OrderFlowAdvanceRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Order flow advance received with no Principal - the WebSocket handshake "
                    + "didn't resolve a visitorId (see VisitorHandshakeHandler), so there is no "
                    + "queue to push the delayed status to. Dropping this advance request.");
            return;
        }

        String visitorId = principal.getName();
        int nextStep = Math.min(request.currentStep() + 1, OrderFlowService.TOTAL_STEPS);
        log.info("Order flow advance requested by visitor {} -> step {} in {}s", visitorId, nextStep, ADVANCE_DELAY_SECONDS);
        orderFlowScheduler.schedule(() -> {
            log.info("Pushing order flow step {} to visitor {}", nextStep, visitorId);
            messagingTemplate.convertAndSendToUser(visitorId, FLOW_QUEUE, orderFlowService.statusFor(nextStep));
        }, ADVANCE_DELAY_SECONDS, TimeUnit.SECONDS);
    }
}
