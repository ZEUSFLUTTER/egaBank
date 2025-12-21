package com.ega.bank.bank_management_system.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ega.bank.bank_management_system.entities.CompteBancaire;

import jakarta.transaction.Transactional;

@Repository
@Transactional

public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
    Optional<CompteBancaire> findByNumCompte(@Param("numCompte") String numCompte);
    
}
