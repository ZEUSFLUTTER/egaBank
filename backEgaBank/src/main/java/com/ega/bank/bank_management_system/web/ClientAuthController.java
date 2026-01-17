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

@RestController
@RequestMapping("/api/auth/client")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ClientAuthController {
    
    private final ClientService clientService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@Valid @RequestBody RegisterClientDto registerDto) {
        try {
            Client client = clientService.registerClient(registerDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(client);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginClient(@Valid @RequestBody LoginRequestDto loginDto) {
        try {
            LoginResponseDto response = clientService.authenticateClient(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
