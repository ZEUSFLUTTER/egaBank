package com.ega.bank.bank_management_system.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    private String nom;
    private String prenom;
    private Date birthday;
    private String sexe;
    private String telephone;
    private String email;
    private String address;
    private String nationalite;
}
