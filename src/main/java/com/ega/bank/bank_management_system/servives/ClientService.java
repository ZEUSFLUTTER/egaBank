package com.ega.bank.bank_management_system.servives;

import java.util.List;

import com.ega.bank.bank_management_system.dto.ClientDto;
import com.ega.bank.bank_management_system.entities.Client;

public interface ClientService {

    void createNewClient(ClientDto clientDto);

    List<Client> findAll();

    Client findOne(long id);

}
