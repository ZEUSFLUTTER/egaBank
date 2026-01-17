package com.ega.bank.bank_management_system.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.enums.ClientStatus;

import jakarta.transaction.Transactional;

@Repository
@Transactional
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmail(String email);
    
    Optional<Client> findByTelephone(String telephone);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByTelephone(String telephone);
    
    List<Client> findByStatus(ClientStatus status);
    
    @Query("SELECT c FROM Client c WHERE c.nom LIKE %:keyword% OR c.prenom LIKE %:keyword% OR c.email LIKE %:keyword%")
    List<Client> searchClients(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(c) FROM Client c WHERE c.status = :status")
    Long countByStatus(@Param("status") ClientStatus status);
}
