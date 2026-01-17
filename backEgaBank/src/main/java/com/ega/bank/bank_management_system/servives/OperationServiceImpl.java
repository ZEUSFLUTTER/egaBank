package com.ega.bank.bank_management_system.servives;

import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.dto.OperationRequestDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.Operation;
import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.ega.bank.bank_management_system.enums.TypeOperation;
import com.ega.bank.bank_management_system.repositories.CompteBancaireRepository;
import com.ega.bank.bank_management_system.repositories.OperationRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OperationServiceImpl implements OperationService {

    private final CompteBancaireRepository compteBancaireRepository;
    private final OperationRepository operationRepository;
    private final EmailService emailService;

    @Override
    public CompteBancaire effectuerVersement(OperationDto dto) {
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(dto.getNumCompteSource())
            .orElseThrow(() -> new RuntimeException("Ce compte n'existe pas"));

        if (!compte.getStatus().equals(AccountStatus.ACTIVATED)) {
            throw new RuntimeException("Le compte est suspendu");
        }

        compte.setBalance(compte.getBalance() + dto.getAmount());
        compte = compteBancaireRepository.save(compte);

        Operation operation = new Operation();
        operation.setDateOperation(new Date());
        operation.setAmount(dto.getAmount());
        operation.setTypeOperation(TypeOperation.DEPOT);
        operation.setCompte(compte);
        operation.setNumOperation(generateNumeroOperation());

        operationRepository.save(operation);

        if (compte.getClient().getEmail() != null) {
            emailService.envoyerNotification(
                compte.getClient().getEmail(),
                "Avis de Crédit - EgaBank",
                "Cher client, votre compte " + compte.getNumCompte() + 
                " a été crédité de " + dto.getAmount() + " FCFA. Nouveau solde: " + 
                compte.getBalance() + " FCFA."
            );
        }

        return compte;
    }

    @Override
    public CompteBancaire effectuerRetrait(OperationDto dto) {
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(dto.getNumCompteSource())
            .orElseThrow(() -> new RuntimeException("Ce compte n'existe pas"));

        if (!compte.getStatus().equals(AccountStatus.ACTIVATED)) {
            throw new RuntimeException("Le compte est suspendu");
        }

        if (compte.getBalance() < dto.getAmount()) {
            throw new RuntimeException("Solde insuffisant");
        }

        compte.setBalance(compte.getBalance() - dto.getAmount());
        compte = compteBancaireRepository.save(compte);

        Operation operation = new Operation();
        operation.setDateOperation(new Date());
        operation.setAmount(dto.getAmount());
        operation.setTypeOperation(TypeOperation.RETRAIT);
        operation.setCompte(compte);
        operation.setNumOperation(generateNumeroOperation());

        operationRepository.save(operation);

        if (compte.getClient().getEmail() != null) {
            emailService.envoyerNotification(
                compte.getClient().getEmail(),
                "Avis de Retrait - EgaBank",
                "Cher client, un retrait de " + dto.getAmount() + 
                " FCFA a été effectué sur votre compte " + compte.getNumCompte() + 
                ". Nouveau solde: " + compte.getBalance() + " FCFA."
            );
        }

        return compte;
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

            if (compteBancaireSource.getClient().getEmail() != null) {
                emailService.envoyerNotification(
                    compteBancaireSource.getClient().getEmail(),
                    "Confirmation de Virement - EgaBank",
                    "Votre virement de " + dto.getAmount() + " FCFA vers le compte " + 
                    numCompteDestination + " a été exécuté avec succès."
                );
            }
            return true;
        }
        return false;
    }

    @Override
    public Operation effectuerOperation(OperationRequestDto dto) {
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(dto.getNumCompte())
            .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        if (!compte.getStatus().equals(AccountStatus.ACTIVATED)) {
            throw new RuntimeException("Le compte est suspendu");
        }

        Operation operation = new Operation();
        operation.setDateOperation(new Date());
        operation.setAmount(dto.getAmount());
        operation.setTypeOperation(dto.getTypeOperation());
        operation.setCompte(compte);
        operation.setNumOperation(generateNumeroOperation());

        switch (dto.getTypeOperation()) {
            case DEPOT:
                compte.setBalance(compte.getBalance() + dto.getAmount());
                break;
            case RETRAIT:
                if (compte.getBalance() < dto.getAmount()) {
                    throw new RuntimeException("Solde insuffisant");
                }
                compte.setBalance(compte.getBalance() - dto.getAmount());
                break;
            case VIREMENT:
                if (dto.getNumCompteDestinataire() == null) {
                    throw new RuntimeException("Compte destinataire requis pour un virement");
                }
                if (compte.getBalance() < dto.getAmount()) {
                    throw new RuntimeException("Solde insuffisant");
                }
                compte.setBalance(compte.getBalance() - dto.getAmount());
                
                CompteBancaire compteDestinataire = compteBancaireRepository
                    .findByNumCompte(dto.getNumCompteDestinataire())
                    .orElseThrow(() -> new RuntimeException("Compte destinataire non trouvé"));
                compteDestinataire.setBalance(compteDestinataire.getBalance() + dto.getAmount());
                compteBancaireRepository.save(compteDestinataire);
                break;
            default:
                throw new RuntimeException("Type d'opération non supporté");
        }

        compteBancaireRepository.save(compte);
        return operationRepository.save(operation);
    }

    @Override
    public List<Operation> findByClientNumCompte(String numCompte) {
        return operationRepository.findAll().stream()
            .filter(o -> o.getCompte().getNumCompte().equals(numCompte))
            .toList();
    }

    @Override
    public List<Operation> findAllOperations() {
        return operationRepository.findAll();
    }

    @Override
    public Operation findOperationById(Long id) {
        return operationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Opération non trouvée"));
    }

    @Override
    public String generateNumeroOperation() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        sb.append("OP");
        sb.append(System.currentTimeMillis());
        sb.append(random.nextInt(1000));
        return sb.toString();
    }
}
