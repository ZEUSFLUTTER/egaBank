package com.ega.bank.bank_management_system.servives;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.CompteDto;
import com.ega.bank.bank_management_system.dto.CreateCompteDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.CompteCourant;
import com.ega.bank.bank_management_system.entities.CompteEpargne;
import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.ega.bank.bank_management_system.exceptions.AccountException;
import com.ega.bank.bank_management_system.exceptions.ClientException;
import com.ega.bank.bank_management_system.repositories.ClientRepository;
import com.ega.bank.bank_management_system.repositories.CompteBancaireRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CompteServiceImpl implements CompteService {

    private final CompteBancaireRepository compteBancaireRepository;
    private final ClientRepository clientRepository;

    @Override
    public CompteBancaire createAccount(CompteDto compteDto) {
        Client client = clientRepository.findById(compteDto.getClientId())
            .orElseThrow(() -> ClientException.clientNotFound(compteDto.getClientId()));

        if (compteDto.getDecouvert() > 0) {
            CompteCourant cc = new CompteCourant();
            cc.setCreatedAt(new Date());
            cc.setBalance(compteDto.getBalance());
            cc.setDecouvert(compteDto.getDecouvert());
            cc.setClient(client);
            cc.setStatus(AccountStatus.ACTIVATED);
            cc.setNumCompte(generateNumeroCompte());
            return compteBancaireRepository.save(cc);
        } else {
            CompteEpargne ce = new CompteEpargne();
            ce.setCreatedAt(new Date());
            ce.setBalance(compteDto.getBalance());
            ce.setTauxInteret(compteDto.getTauxInteret());
            ce.setClient(client);
            ce.setStatus(AccountStatus.ACTIVATED);
            ce.setNumCompte(generateNumeroCompte());
            return compteBancaireRepository.save(ce);
        }
    }

    @Override
    public CompteBancaire createAccountForClient(Long clientId, CreateCompteDto createCompteDto) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> ClientException.clientNotFound(clientId));

        CompteBancaire compte;
        
        if (createCompteDto.getTypeCompte() == 1) {
            CompteCourant cc = new CompteCourant();
            cc.setDecouvert(createCompteDto.getDecouvert() != null ? createCompteDto.getDecouvert() : 0.0);
            compte = cc;
        } else if (createCompteDto.getTypeCompte() == 2) {
            CompteEpargne ce = new CompteEpargne();
            ce.setTauxInteret(createCompteDto.getTauxInteret() != null ? createCompteDto.getTauxInteret() : 0.0);
            compte = ce;
        } else {
            throw AccountException.invalidAccountType(createCompteDto.getTypeCompte());
        }

        compte.setNumCompte(generateNumeroCompte());
        compte.setBalance(createCompteDto.getBalanceInitial());
        compte.setDevis(createCompteDto.getDevis());
        compte.setClient(client);
        compte.setStatus(AccountStatus.ACTIVATED);
        compte.setCreatedAt(new Date());

        return compteBancaireRepository.save(compte);
    }

    @Override
    public List<CompteEpargne> findCompteEpargnes() {
        List<CompteEpargne> list = new ArrayList<>();
        for (CompteBancaire c : compteBancaireRepository.findAll()) {
            if (c instanceof CompteEpargne epargne) {
                list.add(epargne);
            }
        }
        return list;
    }

    @Override
    public List<CompteCourant> findCompteCourants() {
        List<CompteCourant> list = new ArrayList<>();
        for (CompteBancaire c : compteBancaireRepository.findAll()) {
            if (c instanceof CompteCourant courant) {
                list.add(courant);
            }
        }
        return list;
    }

    @Override
    public List<CompteBancaire> findComptesByClientId(Long clientId) {
        Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> ClientException.clientNotFound(clientId));
        return new ArrayList<>(client.getComptes());
    }

    @Override
    public CompteBancaire findOne(String numCompte) {
        return compteBancaireRepository.findByNumCompte(numCompte)
            .orElseThrow(() -> AccountException.accountNotFound(numCompte));
    }

    @Override
    public CompteBancaire findById(Long id) {
        return compteBancaireRepository.findById(id)
            .orElseThrow(() -> AccountException.accountNotFound("ID: " + id));
    }

    @Override
    public boolean activeCompte(String numCompte) {
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(numCompte)
            .orElseThrow(() -> AccountException.accountNotFound(numCompte));
        
        if (compte.getStatus() == AccountStatus.SUSPENDED) {
            compte.setStatus(AccountStatus.ACTIVATED);
            compteBancaireRepository.save(compte);
            return true;
        }
        return false;
    }

    @Override
    public boolean suspendCompte(String numCompte) {
        CompteBancaire compte = compteBancaireRepository.findByNumCompte(numCompte)
            .orElseThrow(() -> AccountException.accountNotFound(numCompte));
        
        if (compte.getStatus() == AccountStatus.ACTIVATED) {
            compte.setStatus(AccountStatus.SUSPENDED);
            compteBancaireRepository.save(compte);
            return true;
        }
        return false;
    }

    @Override
    public void deleteCompte(String numCompte) {
        CompteBancaire compte = findOne(numCompte);
        compteBancaireRepository.delete(compte);
    }

    @Override
    public String generateNumeroCompte() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        
        // Format: CMEG A1.2 8895 1140 0271 e
        sb.append("CMEG ");
        sb.append("A").append(random.nextInt(10)).append(".");
        sb.append(random.nextInt(10)).append(" ");
        
        for (int i = 0; i < 4; i++) {
            if (i > 0) sb.append(" ");
            for (int j = 0; j < 4; j++) {
                sb.append(random.nextInt(10));
            }
        }
        
        sb.append(" e");
        
        return sb.toString();
    }
}
