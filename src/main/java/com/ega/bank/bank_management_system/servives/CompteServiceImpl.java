package com.ega.bank.bank_management_system.servives;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Date; 

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.CompteDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.CompteCourant;
import com.ega.bank.bank_management_system.entities.CompteEpargne;
import com.ega.bank.bank_management_system.enums.AccountStatus;
import com.ega.bank.bank_management_system.repositories.ClientRepository;
import com.ega.bank.bank_management_system.repositories.CompteBancaireRepository;

@Service
@Transactional
public class CompteServiceImpl implements CompteService {

    private final CompteBancaireRepository compteBancaireRepository;
    private final ClientRepository clientRepository;

    public CompteServiceImpl(
            final CompteBancaireRepository compteBancaireRepository,
            final ClientRepository clientRepository
    ) { 
        this.clientRepository = clientRepository;
        this.compteBancaireRepository = compteBancaireRepository;
    }

    @Override
    public void createAccount(CompteDto compteDto) {
        Optional<Client> clientOpt = this.clientRepository.findById(compteDto.getClientId());

        if (clientOpt.isPresent() && compteDto.getDecouvert() > 0 && compteDto.getTauxInteret() == 0) {
            CompteCourant compteCourant = new CompteCourant();
            compteCourant.setCreatedAt(new Date());
            compteCourant.setBalance(compteDto.getBalance());
            compteCourant.setDecouvert(compteDto.getDecouvert());
            compteCourant.setClient(clientOpt.get());
            compteCourant.setDevis(compteDto.getDevis());
            compteCourant.setStatus(AccountStatus.ACTIVATED);
            compteCourant.setNumCompte(generateAccountNumber());

            this.compteBancaireRepository.save(compteCourant);
        }

        if (clientOpt.isPresent() && compteDto.getDecouvert() == 0 && compteDto.getTauxInteret() > 0) {
            CompteEpargne compteEpargne = new CompteEpargne();
            compteEpargne.setCreatedAt(new Date());
            compteEpargne.setBalance(compteDto.getBalance());
            compteEpargne.setTauxInteret(compteDto.getTauxInteret());
            compteEpargne.setClient(clientOpt.get());
            compteEpargne.setDevis(compteDto.getDevis());
            compteEpargne.setStatus(AccountStatus.ACTIVATED);
            compteEpargne.setNumCompte(generateAccountNumber());

            this.compteBancaireRepository.save(compteEpargne);
        }
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
    public boolean activeCompte(String numCompte) {
        Optional<CompteBancaire> compte =this.compteBancaireRepository.findByNumCompte(numCompte);
        if(compte.isPresent() && compte.get().getStatus().equals(AccountStatus.SUSPENDED)){
            CompteBancaire c =  compte.get();
            c.setStatus(AccountStatus.ACTIVATED);
            this.compteBancaireRepository.save(c);
            return true;
        }else{
            return false;
        }
    }

    @Override
    public boolean suspendCompte(String numCompte) {
        Optional<CompteBancaire> compte =this.compteBancaireRepository.findByNumCompte(numCompte);
        if(compte.isPresent() && compte.get().getStatus().equals(AccountStatus.ACTIVATED)){
            CompteBancaire c =  compte.get();
            c.setStatus(AccountStatus.SUSPENDED);
            this.compteBancaireRepository.save(c);
            return true;
        }else{
            return false;
        }
    }


    @Override
    public CompteBancaire findOne(String numCompte) {
        return this.compteBancaireRepository.findByNumCompte(numCompte).orElse(null);
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
