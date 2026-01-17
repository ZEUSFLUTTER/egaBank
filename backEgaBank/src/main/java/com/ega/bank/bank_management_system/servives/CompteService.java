package com.ega.bank.bank_management_system.servives;

import java.util.List;

import com.ega.bank.bank_management_system.dto.CompteDto;
import com.ega.bank.bank_management_system.dto.CreateCompteDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.CompteCourant;
import com.ega.bank.bank_management_system.entities.CompteEpargne;

public interface CompteService {
    CompteBancaire createAccount(CompteDto compteDto);
    
    CompteBancaire createAccountForClient(Long clientId, CreateCompteDto createCompteDto);

    List<CompteEpargne> findCompteEpargnes();
    
    List<CompteCourant> findCompteCourants();
    
    List<CompteBancaire> findComptesByClientId(Long clientId);
    
    CompteBancaire findOne(String numCompte);
    
    CompteBancaire findById(Long id);
    
    boolean activeCompte(String numCompte);
    
    boolean suspendCompte(String numCompte);
    
    void deleteCompte(String numCompte);
    
    String generateNumeroCompte();
}
