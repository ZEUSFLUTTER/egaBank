package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Client implements Serializable{
    
    @Id  @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    private String nom;
    private String prenom;
    private Date birthday;
    private String sexe;
    private String telephone;
    private String email;
    private String address;
    private String nationalite;

    @OneToMany(mappedBy="client")

    private Collection<CompteBancaire> compte = new ArrayList<>();
}
