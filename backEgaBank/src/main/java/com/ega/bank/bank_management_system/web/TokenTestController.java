package com.ega.bank.bank_management_system.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TokenTestController {

    @GetMapping("/generate-token")
    public ResponseEntity<?> generateToken() {
        // Générer un token simple pour les tests
        String timestamp = String.valueOf(System.currentTimeMillis());
        String tokenData = "malik@gmail.com:103:" + timestamp;
        String token = "EgaBank-" + java.util.Base64.getEncoder().encodeToString(tokenData.getBytes());
        
        // Afficher le token dans la console
        System.out.println("\n" + "=".repeat(80));
        System.out.println("🔐 TOKEN GÉNÉRÉ - COPIEZ CE TOKEN:");
        System.out.println("📋 Token: " + token);
        System.out.println("🎯 Pour Postman: Authorization: Bearer " + token);
        System.out.println("👤 Client ID: 103");
        System.out.println("📧 Email: malik@gmail.com");
        System.out.println("👤 Full Name: malik DOGBLA");
        System.out.println("📊 Status: ACTIVE");
        System.out.println("=".repeat(80) + "\n");
        
        return ResponseEntity.ok(new TokenResponse(token, "Bearer", 103L, "malik@gmail.com", "malik DOGBLA", "ACTIVE"));
    }
    
    public static class TokenResponse {
        private String token;
        private String type;
        private Long clientId;
        private String email;
        private String fullName;
        private String status;
        
        public TokenResponse(String token, String type, Long clientId, String email, String fullName, String status) {
            this.token = token;
            this.type = type;
            this.clientId = clientId;
            this.email = email;
            this.fullName = fullName;
            this.status = status;
        }
        
        // Getters
        public String getToken() { return token; }
        public String getType() { return type; }
        public Long getClientId() { return clientId; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getStatus() { return status; }
    }
}
