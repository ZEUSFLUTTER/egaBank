package com.ega.bank.bank_management_system.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ega.bank.bank_management_system.entities.Operation;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface OperationRepository extends JpaRepository<Operation, Long> {
    List<Operation> findByCompteNumCompte(String numCompte);
    
    @Query(value = "SELECT o FROM Operation o ORDER BY o.dateOperation DESC")
    List<Operation> findRecentOperations(Pageable pageable);
}
