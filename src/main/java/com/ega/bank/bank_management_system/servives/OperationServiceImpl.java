package com.ega.bank.bank_management_system.servives;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.Operation;
import com.ega.bank.bank_management_system.enums.TypeOperation;
import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.ega.bank.bank_management_system.repositories.CompteBancaireRepository;
import com.ega.bank.bank_management_system.repositories.OperationRepository;

@Service
@Transactional
public class OperationServiceImpl implements OperationService {

    private final CompteBancaireRepository compteBancaireRepository;
    private final OperationRepository operationRepository;

    public OperationServiceImpl(CompteBancaireRepository compteBancaireRepository, OperationRepository operationRepository) {
        this.compteBancaireRepository = compteBancaireRepository;
        this.operationRepository = operationRepository;
    }

    @Override
    public CompteBancaire effectuerVersement(OperationDto dto) {
        Optional<CompteBancaire> compteOpt = this.compteBancaireRepository.findByNumCompte(dto.getNumCompteSource());

        if (compteOpt.isPresent()) {
            CompteBancaire compte = compteOpt.get();

            if (compte.getStatus().equals(AccountStatus.ACTIVATED)) {
                compte.setBalance(compte.getBalance() + dto.getAmount());
                compte = this.compteBancaireRepository.save(compte);

                Operation operation = new Operation();
                operation.setDateOperation(new Date());
                operation.setAmount(dto.getAmount());
                operation.setTypeOperation(TypeOperation.CREDIT);
                operation.setCompte(compte);
                operation.setNumOperation(generateAccountNumber());

                this.operationRepository.save(operation);
                return compte;
            } else {
                throw new RuntimeException("Dsl le compte est suspendu");
            }
        } else {
            throw new RuntimeException("Ce compte n'existe pas");
        }
    }

    @Override
    public CompteBancaire effectuerRetrait(OperationDto dto) {
        Optional<CompteBancaire> compteOpt = this.compteBancaireRepository.findByNumCompte(dto.getNumCompteSource());

        if (compteOpt.isPresent()) {
            CompteBancaire compte = compteOpt.get();

            if (compte.getStatus().equals(AccountStatus.ACTIVATED) && compte.getBalance() >= dto.getAmount()) {
                compte.setBalance(compte.getBalance() - dto.getAmount());
                compte = this.compteBancaireRepository.save(compte);

                Operation operation = new Operation();
                operation.setDateOperation(new Date());
                operation.setAmount(dto.getAmount());
                operation.setTypeOperation(TypeOperation.DEBIT);
                operation.setCompte(compte);
                operation.setNumOperation(generateAccountNumber());

                this.operationRepository.save(operation);
                return compte;
            } else {
                throw new RuntimeException("Dsl le solde est insuffisant ou compte suspendu");
            }
        } else {
            throw new RuntimeException("Ce compte n'existe pas");
        }
    }

    @Override
    public boolean effectuerVirement(OperationDto dto) {

        String numCompteSource = dto.getNumCompteSource();
        OperationDto dtoSource = new OperationDto(numCompteSource, null, dto.getAmount());

        CompteBancaire compteBancaireSource = effectuerRetrait(dtoSource);

        if (compteBancaireSource != null) {
            String numCompteDestination = dto.getNumCompteDestination();
            OperationDto dtoDestination = new OperationDto(numCompteDestination, numCompteDestination, dto.getAmount());
            effectuerVersement(dtoDestination);
            return true;
        }
        return false;
    }

    @Override
    public List<Operation> findByClientNumCompte(String numCompte){
        List<Operation> list =  new ArrayList<>();
        for (Operation o:this.operationRepository.findAll()){
            if(o.getCompte().getNumCompte().equals(numCompte)){
                list.add(o);
            }
        }
        return list;
    }

    private static String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 4; i++) {
            sb.append("0");
        }
        for (int i = 0; i < 4; i++) {
            sb.append(random.nextInt(2));
        }
        for (int i = 0; i < 10; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
