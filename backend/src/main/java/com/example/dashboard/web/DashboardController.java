package com.example.dashboard.web;

import com.example.dashboard.dto.DashboardViewModel;
import com.example.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping({"/", "/dashboard"})
    public DashboardViewModel overview() {
        return dashboardService.buildOverview();
    }
}
