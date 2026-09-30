package com.example.dashboard.dto;

import java.util.List;

public record DashboardViewModel(
        List<StatCard> statCards,
        List<MonthlyPoint> revenueByMonth,
        List<MonthlyPoint> ordersByMonth,
        List<OrderRow> latestOrders) {
}
