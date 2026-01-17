package com.ega.bank.bank_management_system.dto;

import com.ega.bank.bank_management_system.enums.TypeOperation;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OperationRequestDto {
    
    @NotBlank(message = "Le numéro de compte est obligatoire")
    private String numCompte;
    
    @NotNull(message = "Le montant est obligatoire")
    @Min(value = 1, message = "Le montant doit être supérieur à 0")
    private Double amount;
    
    @NotNull(message = "Le type d'opération est obligatoire")
    private TypeOperation typeOperation;
    
    private String description;
    
    // Pour les virements
    private String numCompteDestinataire;
}
