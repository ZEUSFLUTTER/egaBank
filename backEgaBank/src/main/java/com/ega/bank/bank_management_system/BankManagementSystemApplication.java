package com.ega.bank.bank_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BankManagementSystemApplication {

    public static void main(String[] args) {
        // Cette ligne va afficher dans ta console le hash EXACT généré par TON java
        System.out.println("HASH POUR admin123 : " + new BCryptPasswordEncoder().encode("admin123"));
        
        SpringApplication.run(BankManagementSystemApplication.class, args);
    }
}