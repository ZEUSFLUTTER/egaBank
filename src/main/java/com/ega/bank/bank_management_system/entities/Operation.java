package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.Date;

import com.ega.bank.bank_management_system.enums.TypeOperation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Operation implements Serializable{

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    
    private long id;
    @Column(nullable=false)
    private double amount;
    @Column(nullable=false)
    private Date dateOperation;
    @Column(nullable=false)
    private String numOperation;
    @ManyToOne
    private CompteBancaire compte;
    @Column(nullable=false)
    private TypeOperation typeOperation;

}
