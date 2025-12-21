package com.ega.bank.bank_management_system.servives;

import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;

public interface OperationService {

    CompteBancaire effectuerVersement(OperationDto dto);

    CompteBancaire effectuerRetrait(OperationDto dto);

    boolean effectuerVirement(OperationDto dto);
}