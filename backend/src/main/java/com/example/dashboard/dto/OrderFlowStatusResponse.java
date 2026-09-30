package com.example.dashboard.dto;

import java.util.Map;

public record OrderFlowStatusResponse(int currentStep, int totalSteps, Map<String, String> elementStatuses) {
}
