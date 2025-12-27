package com.ega.bank.bank_management_system.dto;
import java.util.List;
import lombok.Data; 

@Data
public class DashboardDto {
    private long totalClients;
    private double totalDeposits;
    private long dailyVolume;
    private long savingsAccounts;
    private long currentAccounts;
    private double averageBalance;
    private List<Double> fluxEvolution;
    private List<OperationDto> recentOperations;
}