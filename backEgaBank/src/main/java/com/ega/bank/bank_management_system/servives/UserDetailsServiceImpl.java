package com.ega.bank.bank_management_system.servives;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ega.bank.bank_management_system.entities.Admin;
import com.ega.bank.bank_management_system.repositories.AdminRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // On cherche l'admin dans la base de données par son username
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le username: " + username));

        // On retourne un objet User que Spring Security comprend
        // admin.getPassword() doit contenir le mot de passe haché ($2a$...)
        return new User(admin.getUsername(), admin.getPassword(), new ArrayList<>());
    }
}