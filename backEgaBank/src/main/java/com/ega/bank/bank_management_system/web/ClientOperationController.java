package com.ega.bank.bank_management_system.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.bank.bank_management_system.dto.OperationRequestDto;
import com.ega.bank.bank_management_system.entities.Operation;
import com.ega.bank.bank_management_system.servives.OperationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/clients/{clientId}/operations")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ClientOperationController {
    
    private final OperationService operationService;
    
    @PostMapping
    public ResponseEntity<?> effectuerOperation(
            @PathVariable Long clientId,
            @Valid @RequestBody OperationRequestDto operationDto) {
        try {
            Operation operation = operationService.effectuerOperation(operationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(operation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/compte/{numCompte}")
    public ResponseEntity<List<Operation>> getOperationsByCompte(
            @PathVariable Long clientId,
            @PathVariable String numCompte) {
        try {
            List<Operation> operations = operationService.findByClientNumCompte(numCompte);
            return ResponseEntity.ok(operations);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
