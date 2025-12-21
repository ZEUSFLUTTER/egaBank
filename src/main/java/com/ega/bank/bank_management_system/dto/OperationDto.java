package com.ega.bank.bank_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OperationDto {
    private long compteID; 
    private double amount;
    
    private String numCompteSource;
    private String numCompteDestination;

    public OperationDto(String numCompteSource, String numCompteDestination, double amount) {
        this.numCompteSource = numCompteSource;
        this.numCompteDestination = numCompteDestination;
        this.amount = amount;
    }
}