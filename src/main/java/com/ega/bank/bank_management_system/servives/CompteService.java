package com.ega.bank.bank_management_system.servives;

import java.util.List;

import com.ega.bank.bank_management_system.dto.CompteDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.CompteCourant;
import com.ega.bank.bank_management_system.entities.CompteEpargne;

public interface CompteService {
    void createAccount(CompteDto compteDto);

    List<CompteEpargne> findCompteEpargnes();
    List<CompteCourant> findCompteCourants();

    CompteBancaire findOne(String numCompte);
    
}
