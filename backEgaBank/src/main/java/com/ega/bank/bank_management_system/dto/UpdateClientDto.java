package com.ega.bank.bank_management_system.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateClientDto {
    private String nom;
    private String prenom;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
    
    private String sexe;
    private String telephone;
    
    @Email(message = "L'email doit être valide")
    private String email;
    
    private String address;
    private String nationalite;
}
