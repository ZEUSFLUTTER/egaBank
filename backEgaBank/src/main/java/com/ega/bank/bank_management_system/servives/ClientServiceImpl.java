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
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.enums.ClientStatus;
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
            throw new RuntimeException("Un compte avec cet email existe déjà");
        }
        
        // Vérifier si le téléphone existe déjà
        if (clientRepository.existsByTelephone(registerDto.getTelephone())) {
            throw new RuntimeException("Un compte avec ce numéro de téléphone existe déjà");
        }
        
        // Vérifier que les mots de passe correspondent
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            throw new RuntimeException("Les mots de passe ne correspondent pas");
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
        client.setProfession(registerDto.getProfession());
        client.setPieceIdentite(registerDto.getPieceIdentite());
        client.setNumeroPiece(registerDto.getNumeroPiece());
        client.setStatus(ClientStatus.PENDING);
        
        return clientRepository.save(client);
    }

    @Override
    public LoginResponseDto authenticateClient(LoginRequestDto loginDto) {
        Client client = clientRepository.findByEmail(loginDto.getEmail())
            .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        
        if (!passwordEncoder.matches(loginDto.getPassword(), client.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
        
        if (client.getStatus() != ClientStatus.ACTIVE) {
            throw new RuntimeException("Votre compte n'est pas actif. Statut: " + client.getStatus());
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
    public void deleteClient(Long id) {
        Client client = findOne(id);
        clientRepository.delete(client);
    }

    @Override
    public Client findOne(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
    }

    @Override
    public Client findByEmail(String email) {
        return clientRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'email: " + email));
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
