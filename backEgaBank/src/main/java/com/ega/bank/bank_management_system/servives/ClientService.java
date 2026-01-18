package com.ega.bank.bank_management_system.servives;

import java.util.List;

import com.ega.bank.bank_management_system.dto.ClientDto;
import com.ega.bank.bank_management_system.dto.LoginRequestDto;
import com.ega.bank.bank_management_system.dto.LoginResponseDto;
import com.ega.bank.bank_management_system.dto.RegisterClientDto;
import com.ega.bank.bank_management_system.dto.UpdateClientDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.enums.ClientStatus;

public interface ClientService {
    Client createNewClient(ClientDto clientDto);
    
    Client registerClient(RegisterClientDto registerDto);
    
    LoginResponseDto authenticateClient(LoginRequestDto loginDto);
    
    Client updateClient(Long id, ClientDto clientDto);
    
    Client partialUpdateClient(Long id, UpdateClientDto updateDto);
    
    void deleteClient(Long id);
    
    Client findOne(Long id);
    
    Client findByEmail(String email);
    
    List<Client> findAll();
    
    List<Client> findByStatus(ClientStatus status);
    
    List<Client> searchClients(String keyword);
    
    Client updateClientStatus(Long id, ClientStatus status);
    
    void updateLastLogin(Long id);
    
    boolean existsByEmail(String email);
    
    boolean existsByTelephone(String telephone);
}
