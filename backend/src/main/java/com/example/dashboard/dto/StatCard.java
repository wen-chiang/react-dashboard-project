package com.example.dashboard.dto;

public record StatCard(String label, String value, double changePercent, String icon) {

    public boolean isPositive() {
        return changePercent >= 0;
    }
}
