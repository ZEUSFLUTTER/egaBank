package com.ega.bank.bank_management_system.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.bank.bank_management_system.dto.DashboardDto;
import com.ega.bank.bank_management_system.servives.DashboardService;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class DashboardController {

private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardDto getStats() {
        return dashboardService.getAllStats();
    }
}
