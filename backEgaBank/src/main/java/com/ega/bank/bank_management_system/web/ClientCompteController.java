package com.ega.bank.bank_management_system.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.bank.bank_management_system.dto.CreateCompteDto;
import com.ega.bank.bank_management_system.entities.CompteBancaire;
import com.ega.bank.bank_management_system.servives.CompteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/clients/{clientId}/comptes")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ClientCompteController {
    
    private final CompteService compteService;
    
    @GetMapping
    public ResponseEntity<List<CompteBancaire>> getClientComptes(@PathVariable Long clientId) {
        try {
            List<CompteBancaire> comptes = compteService.findComptesByClientId(clientId);
            return ResponseEntity.ok(comptes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createCompteForClient(
            @PathVariable Long clientId,
            @Valid @RequestBody CreateCompteDto createCompteDto) {
        try {
            CompteBancaire compte = compteService.createAccountForClient(clientId, createCompteDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(compte);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{numCompte}")
    public ResponseEntity<Void> deleteCompte(
            @PathVariable Long clientId,
            @PathVariable String numCompte) {
        try {
            compteService.deleteCompte(numCompte);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
