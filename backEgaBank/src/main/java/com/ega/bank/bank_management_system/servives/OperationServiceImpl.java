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
        if (dto.getAmount() <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }
        
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(dto.getNumCompteSource())
            .orElseThrow(() -> new RuntimeException("Ce compte n'existe pas"));

        if (!compte.getStatus().equals(AccountStatus.ACTIVATED)) {
            throw new RuntimeException("Le compte est suspendu");
        }

        compte.setBalance(compte.getBalance() + dto.getAmount());
        compte = compteBancaireRepository.save(compte);

        Operation operation = new Operation();
        operation.setDateOperation(new Date());
        operation.setAmount(Math.abs(dto.getAmount())); // S'assurer que le montant est positif
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
        if (dto.getAmount() <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }
        
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
        operation.setAmount(Math.abs(dto.getAmount())); // S'assurer que le montant est positif
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
        System.out.println("=== DEBUT VIREMENT SERVICE ===");
        System.out.println("DTO reçu: " + dto);
        
        try {
            // Validation des données d'entrée
            if (dto.getAmount() <= 0) {
                throw new RuntimeException("Le montant doit être positif");
            }
            
            if (dto.getNumCompteSource() == null || dto.getNumCompteSource().trim().isEmpty()) {
                throw new RuntimeException("Le numéro de compte source est requis");
            }
            
            if (dto.getNumCompteDestination() == null || dto.getNumCompteDestination().trim().isEmpty()) {
                throw new RuntimeException("Le numéro de compte destination est requis");
            }
            
            String numCompteSource = dto.getNumCompteSource();
            String numCompteDestination = dto.getNumCompteDestination();
            
            System.out.println("Recherche du compte source: " + numCompteSource);
            // Vérifier que les comptes existent
            CompteBancaire compteSource = compteBancaireRepository.findByNumCompte(numCompteSource)
                .orElseThrow(() -> new RuntimeException("Compte source n'existe pas"));
            
            System.out.println("Compte source trouvé: " + compteSource.getId() + ", Balance: " + compteSource.getBalance());
            
            System.out.println("Recherche du compte destination: " + numCompteDestination);
            CompteBancaire compteDestination = compteBancaireRepository.findByNumCompte(numCompteDestination)
                .orElseThrow(() -> new RuntimeException("Compte destination n'existe pas"));
            
            System.out.println("Compte destination trouvé: " + compteDestination.getId() + ", Balance: " + compteDestination.getBalance());

            // Vérifier le statut des comptes
            if (!compteSource.getStatus().equals(AccountStatus.ACTIVATED)) {
                throw new RuntimeException("Le compte source est suspendu");
            }
            
            if (!compteDestination.getStatus().equals(AccountStatus.ACTIVATED)) {
                throw new RuntimeException("Le compte destination est suspendu");
            }

            // Vérifier le solde
            if (compteSource.getBalance() < dto.getAmount()) {
                throw new RuntimeException("Solde insuffisant");
            }

            System.out.println("Mise à jour des soldes...");
            // Effectuer le virement
            compteSource.setBalance(compteSource.getBalance() - dto.getAmount());
            compteDestination.setBalance(compteDestination.getBalance() + dto.getAmount());
            
            // Sauvegarder les comptes
            System.out.println("Sauvegarde des comptes...");
            compteBancaireRepository.save(compteSource);
            compteBancaireRepository.save(compteDestination);

            System.out.println("Création de l'opération de débit...");
            // Créer l'opération de débit pour le compte source
            Operation operationDebit = new Operation();
            operationDebit.setDateOperation(new Date());
            operationDebit.setAmount(dto.getAmount()); // Utiliser le montant tel quel
            operationDebit.setTypeOperation(TypeOperation.VIREMENT);
            operationDebit.setCompte(compteSource);
            operationDebit.setNumOperation(generateNumeroOperation());
            
            System.out.println("Opération débit: " + operationDebit.getAmount() + ", NumOp: " + operationDebit.getNumOperation());
            
            try {
                operationRepository.save(operationDebit);
                System.out.println("Opération débit sauvegardée avec succès");
            } catch (Exception e) {
                System.err.println("Erreur sauvegarde opération débit: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Erreur lors de l'enregistrement de l'opération de débit: " + e.getMessage());
            }

            System.out.println("Création de l'opération de crédit...");
            // Créer l'opération de crédit pour le compte destination
            Operation operationCredit = new Operation();
            operationCredit.setDateOperation(new Date());
            operationCredit.setAmount(dto.getAmount()); // Utiliser le montant tel quel
            operationCredit.setTypeOperation(TypeOperation.VIREMENT);
            operationCredit.setCompte(compteDestination);
            operationCredit.setNumOperation(generateNumeroOperation());
            
            System.out.println("Opération crédit: " + operationCredit.getAmount() + ", NumOp: " + operationCredit.getNumOperation());
            
            try {
                operationRepository.save(operationCredit);
                System.out.println("Opération crédit sauvegardée avec succès");
            } catch (Exception e) {
                System.err.println("Erreur sauvegarde opération crédit: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Erreur lors de l'enregistrement de l'opération de crédit: " + e.getMessage());
            }

            System.out.println("=== VIREMENT TERMINE AVEC SUCCES ===");
            return true;
            
        } catch (Exception e) {
            System.err.println("=== ERREUR VIREMENT SERVICE ===");
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Operation effectuerOperation(OperationRequestDto dto) {
        if (dto.getAmount() <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }
        
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(dto.getNumCompte())
            .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        if (!compte.getStatus().equals(AccountStatus.ACTIVATED)) {
            throw new RuntimeException("Le compte est suspendu");
        }

        Operation operation = new Operation();
        operation.setDateOperation(new Date());
        operation.setAmount(Math.abs(dto.getAmount())); // S'assurer que le montant est positif
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
