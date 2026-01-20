package com.ega.bank.bank_management_system.web;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ega.bank.bank_management_system.dto.LoginDto;
import com.ega.bank.bank_management_system.entities.Admin;
import com.ega.bank.bank_management_system.repositories.AdminRepository;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // INJECTION DU BEAN DEFINI DANS SECURITYCONFIG

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @RequestBody LoginDto loginRequest) {
        // LOGS DE DEBUG
        System.out.println("--- TENTATIVE DE CONNEXION ---");
        System.out.println("Username reçu d'Angular : [" + loginRequest.getUsername() + "]");
        System.out.println("Password reçu d'Angular : [" + loginRequest.getPassword() + "]");

        Optional<Admin> admin = adminRepository.findByUsername(loginRequest.getUsername());

    if (admin.isPresent()) {
        System.out.println("Admin trouvé en base !");
        boolean isMatch = passwordEncoder.matches(loginRequest.getPassword(), admin.get().getPassword());
        System.out.println("Match Password : " + isMatch);

        if (isMatch) {
            Admin responseAdmin = admin.get();
            responseAdmin.setPassword(null);
            return ResponseEntity.ok(responseAdmin);
        }
    } else {
        System.out.println("Admin NON trouvé en base avec ce username.");
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identifiants incorrects");
}
}