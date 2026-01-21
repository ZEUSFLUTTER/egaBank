package com.ega.bank.bank_management_system.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.bank.bank_management_system.dto.LoginRequestDto;
import com.ega.bank.bank_management_system.dto.LoginResponseDto;
import com.ega.bank.bank_management_system.dto.RegisterClientDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.servives.ClientService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth/client")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class ClientAuthController {
    
    private final ClientService clientService;
    
    @PostMapping("/register")
    //@Operation(summary = "Inscription client", description = "Crée un nouveau compte client")
    public ResponseEntity<?> registerClient(@Valid @RequestBody RegisterClientDto registerDto) {
        try {
            Client client = clientService.registerClient(registerDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(client);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    //@Operation(summary = "Connexion client", description = "Authentifie un client et retourne un token JWT")
    public ResponseEntity<?> loginClient(@Valid @RequestBody LoginRequestDto loginDto) {
        try {
            LoginResponseDto response = clientService.authenticateClient(loginDto);
            
            // 🔐 Afficher le token dans la console pour faciliter le copier-coller
            System.out.println("\n" + "=".repeat(80));
            System.out.println("🔐 CLIENT TOKEN - COPIEZ CE TOKEN:");
            System.out.println("📋 Token: " + response.getToken());
            System.out.println("🎯 Pour Postman: Authorization: Bearer " + response.getToken());
            System.out.println("👤 Client ID: " + response.getClientId());
            System.out.println("📧 Email: " + response.getEmail());
            System.out.println("👤 Full Name: " + response.getFullName());
            System.out.println("📊 Status: " + response.getStatus());
            System.out.println("=".repeat(80) + "\n");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
