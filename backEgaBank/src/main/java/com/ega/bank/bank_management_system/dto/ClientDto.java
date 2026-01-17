package com.ega.bank.bank_management_system.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotNull(message = "La date de naissance est requise")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
    
    @NotBlank(message = "Le sexe est requis")
    private String sexe;
    
    @NotBlank(message = "Le téléphone est requis")
    private String telephone;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être valide")
    private String email;
    
    @NotBlank(message = "L'adresse est requise")
    private String address;
    
    @NotBlank(message = "La nationalité est requise")
    private String nationalite;
}
