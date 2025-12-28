package com.ega.bank.bank_management_system.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ega.bank.bank_management_system.entities.CompteBancaire;

@Repository
public interface DashboardRepository extends JpaRepository<CompteBancaire, Long> {

    @Query("SELECT COUNT(c) FROM Client c")
    Long countAllClients();

    @Query("SELECT SUM(cp.balance) FROM CompteBancaire cp")
    Double sumAllDeposits();

    @Query("SELECT SUM(o.amount) FROM Operation o WHERE o.dateOperation > :date GROUP BY o.dateOperation")
    List<Double> getEvolutionFlux(@Param("date") LocalDateTime date);

    // Correction : On vérifie la classe de l'entité (CompteCourant)
    @Query("SELECT COUNT(c) FROM CompteBancaire c WHERE TYPE(c) = CompteCourant")
    long countCurrentAccounts();

    // Correction : On vérifie la classe de l'entité (CompteEpargne)
    @Query("SELECT COUNT(c) FROM CompteBancaire c WHERE TYPE(c) = CompteEpargne")
    Long countSavingsAccounts();

    @Query("SELECT AVG(c.balance) FROM CompteBancaire c")
    Double getAverageBalance();

    @Query("SELECT COUNT(o) FROM Operation o WHERE o.dateOperation > CURRENT_DATE")
    Long getDailyVolume();
}