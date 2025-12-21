package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;

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
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date birthday;
    private String sexe;
    private String telephone;
    private String email;
    private String address;
    private String nationalite;

    @JsonBackReference
    @OneToMany(mappedBy="client")

    private Collection<CompteBancaire> compte = new ArrayList<>();
}
