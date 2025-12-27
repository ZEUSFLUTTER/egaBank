package com.ega.bank.bank_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; 

@SpringBootApplication
@EnableAsync 
public class BankManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankManagementSystemApplication.class, args);
    }
}