package com.ega.bank.bank_management_system.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCompteDto {
    
    @NotNull(message = "Le type de compte est obligatoire")
    private Integer typeCompte; // 1 = Courant, 2 = Epargne
    
    @NotNull(message = "Le solde initial est obligatoire")
    @Min(value = 0, message = "Le solde initial doit être positif")
    private Double balanceInitial;
    
    @NotBlank(message = "La devise est obligatoire")
    private String devis = "FCFA";
    
    // Pour compte courant
    private Double decouvert;
    
    // Pour compte épargne
    private Double tauxInteret;
}
