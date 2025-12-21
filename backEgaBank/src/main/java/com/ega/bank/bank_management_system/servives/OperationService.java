package com.ega.bank.bank_management_system.servives;

import java.util.List;

import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.Operation;

public interface OperationService {

    CompteBancaire effectuerVersement(OperationDto dto);
    CompteBancaire effectuerRetrait(OperationDto dto);
    boolean effectuerVirement(OperationDto dto);
    List<Operation> findByClientNumCompte(String numCompte);

}