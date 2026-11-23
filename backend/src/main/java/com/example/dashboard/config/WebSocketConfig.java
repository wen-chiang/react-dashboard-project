package com.example.dashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * STOMP-over-WebSocket broker used to push live order notifications to every
 * open browser tab (/topic/orders) as well as per-user updates that only the
 * requesting user should see (/user/queue/... - see OrderFlowSocketController).
 * SockJS fallback keeps it working without extra proxy config in
 * environments that block raw WebSocket upgrades.
 *
 * No custom HandshakeHandler is needed here: now that SecurityConfig
 * requires a logged-in session for /ws/**, the default HandshakeHandler
 * already resolves the STOMP session's Principal from
 * HttpServletRequest.getUserPrincipal() - i.e. whoever Spring Security just
 * authenticated - which is exactly what convertAndSendToUser(...) needs.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /queue is required alongside /topic for convertAndSendToUser(...) -
        // Spring rewrites /user/{id}/queue/... to a session-specific /queue/...
        // destination, which the broker only relays if that prefix is registered.
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}
