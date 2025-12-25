package com.ega.bank.bank_management_system.servives;

import com.ega.bank.bank_management_system.dto.ClientDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.repositories.ClientRepository;
import lombok.RequiredArgsConstructor; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

private final ClientRepository clientRepository;

    @Override
    public Client createNewClient(ClientDto clientDto) {
        Client client = new Client();
        client.setNom(clientDto.getNom());
        client.setPrenom(clientDto.getPrenom());
        client.setBirthday(clientDto.getBirthday());
        client.setAddress(clientDto.getAddress());
        client.setEmail(clientDto.getEmail());
        client.setNationalite(clientDto.getNationalite());
        client.setTelephone(clientDto.getTelephone());
        client.setSexe(clientDto.getSexe());
        
        return this.clientRepository.save(client);
    }

    @Override
    public List<Client> findAll() {
        return this.clientRepository.findAll();
    }

    @Override
    public Client findOne(long id) {
        return this.clientRepository.getReferenceById(id);
    }
}