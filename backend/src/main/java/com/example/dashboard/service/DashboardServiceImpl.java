package com.example.dashboard.service;

import com.example.dashboard.domain.Order;
import com.example.dashboard.domain.OrderStatus;
import com.example.dashboard.dto.DashboardViewModel;
import com.example.dashboard.dto.MonthlyPoint;
import com.example.dashboard.dto.OrderRow;
import com.example.dashboard.dto.StatCard;
import com.example.dashboard.repository.CustomerRepository;
import com.example.dashboard.repository.OrderRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int TREND_MONTHS = 6;
    private static final NumberFormat CURRENCY_FORMAT = NumberFormat.getCurrencyInstance(Locale.US);

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @Override
    public DashboardViewModel buildOverview() {
        List<Order> orders = orderRepository.findAll();
        Map<YearMonth, List<Order>> ordersByMonth = orders.stream()
                .collect(Collectors.groupingBy(order -> YearMonth.from(order.getOrderDate()), TreeMap::new, Collectors.toList()));

        YearMonth currentMonth = YearMonth.now();
        YearMonth previousMonth = currentMonth.minusMonths(1);

        BigDecimal currentRevenue = revenueFor(ordersByMonth, currentMonth);
        BigDecimal previousRevenue = revenueFor(ordersByMonth, previousMonth);

        long currentOrderCount = ordersByMonth.getOrDefault(currentMonth, List.of()).size();
        long previousOrderCount = ordersByMonth.getOrDefault(previousMonth, List.of()).size();

        BigDecimal currentAverage = average(currentRevenue, currentOrderCount);
        BigDecimal previousAverage = average(previousRevenue, previousOrderCount);

        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);

        List<StatCard> statCards = List.of(
                new StatCard("Total Sales", CURRENCY_FORMAT.format(currentRevenue),
                        percentChange(previousRevenue, currentRevenue), "dollar-sign"),
                new StatCard("Total Orders", String.valueOf(currentOrderCount),
                        percentChange(BigDecimal.valueOf(previousOrderCount), BigDecimal.valueOf(currentOrderCount)), "shopping-cart"),
                new StatCard("Avg. Order Value", CURRENCY_FORMAT.format(currentAverage),
                        percentChange(previousAverage, currentAverage), "trending-up"),
                new StatCard("Pending Orders", String.valueOf(pendingOrders), 0, "clock"));

        List<YearMonth> trend = trailingMonths(currentMonth);

        List<MonthlyPoint> revenueTrend = trend.stream()
                .map(month -> new MonthlyPoint(monthLabel(month), revenueFor(ordersByMonth, month).doubleValue()))
                .toList();

        List<MonthlyPoint> orderCountTrend = trend.stream()
                .map(month -> new MonthlyPoint(monthLabel(month), (double) ordersByMonth.getOrDefault(month, List.of()).size()))
                .toList();

        List<OrderRow> latestOrders = orderRepository.findTop5ByOrderByOrderDateDesc().stream()
                .map(order -> new OrderRow(
                        order.getOrderNumber(),
                        order.getCustomer().getName(),
                        order.getCustomer().getInitials(),
                        order.getOrderDate(),
                        order.getAmount(),
                        order.getStatus().name()))
                .toList();

        return new DashboardViewModel(statCards, revenueTrend, orderCountTrend, latestOrders);
    }

    private BigDecimal revenueFor(Map<YearMonth, List<Order>> ordersByMonth, YearMonth month) {
        return ordersByMonth.getOrDefault(month, List.of()).stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal average(BigDecimal revenue, long count) {
        if (count == 0) {
            return BigDecimal.ZERO;
        }
        return revenue.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
    }

    private double percentChange(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) == 0 ? 0 : 100;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private List<YearMonth> trailingMonths(YearMonth current) {
        List<YearMonth> months = new ArrayList<>();
        for (int i = TREND_MONTHS - 1; i >= 0; i--) {
            months.add(current.minusMonths(i));
        }
        return months;
    }

    private String monthLabel(YearMonth month) {
        return month.getMonth().getDisplayName(TextStyle.SHORT, Locale.US);
    }
}
