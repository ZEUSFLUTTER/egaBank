package com.ega.bank.bank_management_system.web;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ega.bank.bank_management_system.dto.CompteDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.entities.CompteCourant;
import com.ega.bank.bank_management_system.entities.CompteEpargne;
import com.ega.bank.bank_management_system.servives.CompteService;

@RestController
@RequestMapping(value="/api/v1")
@CrossOrigin("*")
public class CompteBancaireRestController {

    private final CompteService compteService;

    public CompteBancaireRestController(final CompteService compteService) {
        this.compteService = compteService;
    }

    @PostMapping("/comptes")
    public void createAccount(@RequestBody CompteDto compteDto) {
        this.compteService.createAccount(compteDto);
    }

    @GetMapping("/comptes/type/{type}")
    public List<?> findAll(@PathVariable("type") String type) {
        if (type.equals("CC")) {
            return this.compteService.findCompteCourants(); 
        }
        if (type.equals("CE")) {
            return this.compteService.findCompteEpargnes();
        }
        return null;
    }

    @GetMapping("/comptes/{numCompte}/{type}")
    public ResponseEntity<?> findCompte(@PathVariable("numCompte") String numCompte, 
                                        @PathVariable("type") String type) {
        
        CompteBancaire compteBancaire = this.compteService.findOne(numCompte);
        
        if (compteBancaire == null) {
            return ResponseEntity.notFound().build();
        }

        if (type.equals("CC") && (compteBancaire instanceof CompteCourant)) {
            return ResponseEntity.ok(compteBancaire);
        }
        
        if (type.equals("CE") && (compteBancaire instanceof CompteEpargne)) {
            return ResponseEntity.ok(compteBancaire); 
        }
        
        return ResponseEntity.badRequest().body("Type de compte non valide pour ce numéro");
    }

    @PutMapping("/comptes/active/{numCompte}")
    public void activeCompte(@PathVariable("numCompte") String numCompte) {
        this.compteService.activeCompte(numCompte);
    }

    @PutMapping("/comptes/suspendre/{numCompte}")
    public void suspendreCompte(@PathVariable("numCompte") String numCompte) {
        this.compteService.suspendCompte(numCompte);
    }
}