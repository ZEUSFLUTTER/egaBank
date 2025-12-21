package com.ega.bank.bank_management_system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ega.bank.bank_management_system.entities.Operation;

import jakarta.transaction.Transactional;

@Repository
@Transactional
public interface OperationRepository extends JpaRepository<Operation, Long> {

}
