package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.Date;

import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.INTEGER)
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public abstract  class CompteBancaire implements Serializable{
    @Id @GeneratedValue(strategy = GenerationType.AUTO)

    private long id;
    private String numCompte;
    private String balance;
    private String devis;
    private AccountStatus status;
    private Date createdAt = new Date();

    @ManyToOne
    private Client client;


}