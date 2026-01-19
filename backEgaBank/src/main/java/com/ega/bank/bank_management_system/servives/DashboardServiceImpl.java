package com.ega.bank.bank_management_system.servives;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service; 
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.DashboardDto;
import com.ega.bank.bank_management_system.dto.OperationDto;
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
        
        // Récupérer les stats du dashboard
        dto.setTotalClients(dashboardRepo.countAllClients());
        dto.setTotalDeposits(dashboardRepo.sumAllDeposits() != null ? dashboardRepo.sumAllDeposits() : 0.0);
        dto.setCurrentAccounts(dashboardRepo.countCurrentAccounts());
        dto.setSavingsAccounts(dashboardRepo.countSavingsAccounts());
        dto.setAverageBalance(dashboardRepo.getAverageBalance() != null ? dashboardRepo.getAverageBalance() : 0.0);
        dto.setDailyVolume(dashboardRepo.getDailyVolume());

        // Récupérer l'évolution des flux sur les 7 derniers jours
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Double> fluxEvolution = dashboardRepo.getEvolutionFlux(sevenDaysAgo);
        if (fluxEvolution == null || fluxEvolution.isEmpty()) {
            // Si pas de données, utiliser des valeurs par défaut
            fluxEvolution = java.util.Arrays.asList(12000.0, 15000.0, 8000.0, 22000.0, 18000.0, 25000.0, 21000.0);
        }
        dto.setFluxEvolution(fluxEvolution);

        // Récupérer les 10 dernières opérations
        Pageable pageable = PageRequest.of(0, 10);
        List<OperationDto> recentOperations = opRepo.findRecentOperations(pageable)
            .stream()
            .map(op -> {
                OperationDto opDto = new OperationDto();
                opDto.setCompteID(op.getCompte().getId());
                opDto.setAmount(op.getAmount());
                opDto.setNumCompteSource(op.getCompte().getNumCompte());
                opDto.setNumCompteDestination("OPERATION");
                return opDto;
            })
            .collect(Collectors.toList());
        
        dto.setRecentOperations(recentOperations);

        return dto;
    }
}