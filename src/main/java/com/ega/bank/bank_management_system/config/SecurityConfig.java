package com.ega.bank.bank_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Obligatoire pour tester POST avec Postman
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Autorise tout le monde
            );
        return http.build();
    }
}