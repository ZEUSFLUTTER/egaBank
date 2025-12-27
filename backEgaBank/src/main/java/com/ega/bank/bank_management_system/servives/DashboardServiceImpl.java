package com.ega.bank.bank_management_system.servives;

import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.DashboardDto;
import com.ega.bank.bank_management_system.repositories.DashboardRepository;
import com.ega.bank.bank_management_system.repositories.OperationRepository;
@Service
@Transactional
public class DashboardServiceImpl implements DashboardService {

    @Autowired private DashboardRepository dashboardRepo;
    @Autowired private OperationRepository opRepo;

    @Override
    public DashboardDto getAllStats() {
        DashboardDto dto = new DashboardDto();
        
        dto.setTotalClients(dashboardRepo.countAllClients());
        dto.setTotalDeposits(dashboardRepo.sumAllDeposits() != null ? dashboardRepo.sumAllDeposits() : 0.0);
        dto.setCurrentAccounts(dashboardRepo.countCurrentAccounts());
        dto.setSavingsAccounts(dashboardRepo.countSavingsAccounts());
        dto.setAverageBalance(dashboardRepo.getAverageBalance() != null ? dashboardRepo.getAverageBalance() : 0.0);
        dto.setDailyVolume(dashboardRepo.getDailyVolume());

        dto.setFluxEvolution(java.util.Arrays.asList(12000.0, 15000.0, 8000.0, 22000.0, 18000.0, 25000.0, 21000.0));

        return dto;
    }
}