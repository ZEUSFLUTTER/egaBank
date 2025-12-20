package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private double amount;
    private Date dateOperation;
    private CompteBancaire compte;

}
