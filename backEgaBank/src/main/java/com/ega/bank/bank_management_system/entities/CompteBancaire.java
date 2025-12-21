package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.INTEGER)
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public abstract  class CompteBancaire implements Serializable{
    @Id @GeneratedValue(strategy = GenerationType.AUTO)

    private long id;
    @Column(nullable=false)
    private String numCompte;
    @Column(nullable=false)
    private double balance;
    @Column(nullable=false)
    private String devis = "CFA";
    private AccountStatus status;
    private Date createdAt = new Date();

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false) 
    private Client client;

    @JsonBackReference
    @OneToMany(mappedBy="compte")

    Collection<Operation> operations = new ArrayList<>();

}