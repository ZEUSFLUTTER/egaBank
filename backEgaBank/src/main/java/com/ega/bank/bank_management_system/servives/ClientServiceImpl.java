package com.ega.bank.bank_management_system.servives;

import java.util.Date;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ega.bank.bank_management_system.dto.ClientDto;
import com.ega.bank.bank_management_system.dto.LoginRequestDto;
import com.ega.bank.bank_management_system.dto.LoginResponseDto;
import com.ega.bank.bank_management_system.dto.RegisterClientDto;
import com.ega.bank.bank_management_system.dto.UpdateClientDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.enums.ClientStatus;
import com.ega.bank.bank_management_system.exceptions.ClientException;
import com.ega.bank.bank_management_system.repositories.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

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
    public Client registerClient(RegisterClientDto registerDto) {
        // Vérifier si l'email existe déjà
        if (clientRepository.existsByEmail(registerDto.getEmail())) {
            throw ClientException.emailAlreadyExists(registerDto.getEmail());
        }
        
        // Vérifier si le téléphone existe déjà
        if (clientRepository.existsByTelephone(registerDto.getTelephone())) {
            throw ClientException.phoneAlreadyExists(registerDto.getTelephone());
        }
        
        // Vérifier que les mots de passe correspondent
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw ClientException.passwordMismatch();
        }
        
        Client client = new Client();
        client.setNom(registerDto.getNom());
        client.setPrenom(registerDto.getPrenom());
        client.setBirthday(registerDto.getBirthday());
        client.setSexe(registerDto.getSexe());
        client.setTelephone(registerDto.getTelephone());
        client.setEmail(registerDto.getEmail());
        client.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        client.setAddress(registerDto.getAddress());
        client.setNationalite(registerDto.getNationalite());
        client.setStatus(ClientStatus.PENDING);
        
        return clientRepository.save(client);
    }

    @Override
    public LoginResponseDto authenticateClient(LoginRequestDto loginDto) {
        Client client = clientRepository.findByEmail(loginDto.getEmail())
            .orElseThrow(() -> ClientException.invalidCredentials());
        
        if (!passwordEncoder.matches(loginDto.getPassword(), client.getPassword())) {
            throw ClientException.invalidCredentials();
        }
        
        if (client.getStatus() != ClientStatus.ACTIVE) {
            throw ClientException.accountNotActive(client.getStatus().toString());
        }
        
        // Mettre à jour la dernière connexion
        updateLastLogin(client.getId());
        
        // Générer un token JWT (à implémenter avec votre service JWT)
        String token = "jwt-token-placeholder"; // TODO: Implémenter la génération de token JWT
        
        return LoginResponseDto.builder()
            .token(token)
            .type("Bearer")
            .clientId(client.getId())
            .email(client.getEmail())
            .fullName(client.getFullName())
            .status(client.getStatus().toString())
            .build();
    }

    @Override
    public Client updateClient(Long id, ClientDto clientDto) {
        Client client = findOne(id);
        
        client.setNom(clientDto.getNom());
        client.setPrenom(clientDto.getPrenom());
        client.setBirthday(clientDto.getBirthday());
        client.setSexe(clientDto.getSexe());
        client.setTelephone(clientDto.getTelephone());
        client.setAddress(clientDto.getAddress());
        client.setNationalite(clientDto.getNationalite());
        
        return clientRepository.save(client);
    }

    @Override
    public Client partialUpdateClient(Long id, UpdateClientDto updateDto) {
        Client client = findOne(id);
        
        // Mettre à jour uniquement les champs non nuls
        if (updateDto.getNom() != null) {
            client.setNom(updateDto.getNom());
        }
        if (updateDto.getPrenom() != null) {
            client.setPrenom(updateDto.getPrenom());
        }
        if (updateDto.getBirthday() != null) {
            client.setBirthday(updateDto.getBirthday());
        }
        if (updateDto.getSexe() != null) {
            client.setSexe(updateDto.getSexe());
        }
        if (updateDto.getTelephone() != null) {
            client.setTelephone(updateDto.getTelephone());
        }
        if (updateDto.getEmail() != null) {
            client.setEmail(updateDto.getEmail());
        }
        if (updateDto.getAddress() != null) {
            client.setAddress(updateDto.getAddress());
        }
        if (updateDto.getNationalite() != null) {
            client.setNationalite(updateDto.getNationalite());
        }
        
        return clientRepository.save(client);
    }

    @Override
    public void deleteClient(Long id) {
        Client client = findOne(id);
        clientRepository.delete(client);
    }

    @Override
    public Client findOne(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> ClientException.clientNotFound(id));
    }

    @Override
    public Client findByEmail(String email) {
        return clientRepository.findByEmail(email)
            .orElseThrow(() -> ClientException.clientNotFound(email));
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public List<Client> findByStatus(ClientStatus status) {
        return clientRepository.findByStatus(status);
    }

    @Override
    public List<Client> searchClients(String keyword) {
        return clientRepository.searchClients(keyword);
    }

    @Override
    public Client updateClientStatus(Long id, ClientStatus status) {
        Client client = findOne(id);
        client.setStatus(status);
        return clientRepository.save(client);
    }

    @Override
    public void updateLastLogin(Long id) {
        Client client = findOne(id);
        client.setLastLoginAt(new Date());
        clientRepository.save(client);
    }

    @Override
    public boolean existsByEmail(String email) {
        return clientRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByTelephone(String telephone) {
        return clientRepository.existsByTelephone(telephone);
    }
}
