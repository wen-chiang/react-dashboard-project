package com.example.dashboard.config;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Backs the delayed WebSocket push on /orders/flow (OrderFlowSocketController)
 * - a plain scheduled pool rather than Spring's @Scheduled/@Async, since the
 * delay is per-request (one-off, 30s from whenever the client asks to
 * advance) rather than a fixed recurring job.
 */
@Configuration
public class SchedulingConfig {

    @Bean(destroyMethod = "shutdown")
    public ScheduledExecutorService orderFlowScheduler() {
        return Executors.newScheduledThreadPool(2);
    }
}
