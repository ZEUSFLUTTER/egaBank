package com.ega.bank.bank_management_system.servives;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.ega.bank.bank_management_system.dto.DashboardDto;
import com.ega.bank.bank_management_system.repositories.CompteBancaireRepository;
public interface DashboardService {
    DashboardDto getAllStats();
}