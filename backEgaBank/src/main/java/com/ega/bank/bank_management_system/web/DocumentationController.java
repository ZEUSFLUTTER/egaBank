package com.ega.bank.bank_management_system.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/docs")
public class DocumentationController {

    @GetMapping
    public Map<String, Object> getApiDocumentation() {
        Map<String, Object> docs = new HashMap<>();
        
        // Informations générales
        docs.put("title", "EgaBank API Documentation");
        docs.put("version", "1.0.0");
        docs.put("description", "API complète pour la gestion bancaire EgaBank");
        docs.put("baseUrl", "http://localhost:8080");
        
        // Endpoints disponibles
        Map<String, Object> endpoints = new HashMap<>();
        
        // Authentification
        Map<String, Object> auth = new HashMap<>();
        auth.put("POST /api/v1/auth/login", "Connexion administrateur");
        auth.put("POST /api/auth/client/register", "Inscription client");
        auth.put("POST /api/auth/client/login", "Connexion client");
        endpoints.put("Authentification", auth);
        
        // Clients
        Map<String, Object> clients = new HashMap<>();
        clients.put("GET /api/v1/clients", "Lister tous les clients");
        clients.put("POST /api/v1/clients", "Créer un client");
        clients.put("GET /api/v1/clients/{id}", "Obtenir un client par ID");
        clients.put("PUT /api/v1/clients/{id}", "Mettre à jour un client");
        clients.put("DELETE /api/v1/clients/{id}", "Supprimer un client");
        clients.put("GET /api/v1/clients/search", "Rechercher des clients");
        clients.put("GET /api/v1/clients/email/{email}", "Chercher par email");
        clients.put("GET /api/v1/clients/status/{status}", "Filtrer par statut");
        endpoints.put("Gestion des Clients", clients);
        
        // Comptes
        Map<String, Object> comptes = new HashMap<>();
        comptes.put("POST /api/v1/comptes", "Créer un compte");
        comptes.put("GET /api/v1/comptes/type/{type}", "Lister par type");
        comptes.put("GET /api/v1/comptes/{numCompte}/{type}", "Obtenir un compte");
        comptes.put("PUT /api/v1/comptes/active/{numCompte}", "Activer un compte");
        comptes.put("PUT /api/v1/comptes/suspendre/{numCompte}", "Suspendre un compte");
        endpoints.put("Gestion des Comptes", comptes);
        
        // Opérations
        Map<String, Object> operations = new HashMap<>();
        operations.put("POST /api/v1/operations/versement", "Effectuer un versement");
        operations.put("POST /api/v1/operations/retrait", "Effectuer un retrait");
        operations.put("POST /api/v1/operations/virement", "Effectuer un virement");
        operations.put("GET /api/v1/operations/client/{numCompte}", "Lister opérations client");
        endpoints.put("Gestion des Opérations", operations);
        
        // Dashboard
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("GET /api/v1/dashboard/stats", "Obtenir les statistiques");
        endpoints.put("Dashboard", dashboard);
        
        // Comptes Clients
        Map<String, Object> comptesClients = new HashMap<>();
        comptesClients.put("GET /api/v1/clients/{clientId}/comptes", "Lister comptes client");
        comptesClients.put("POST /api/v1/clients/{clientId}/comptes", "Créer compte client");
        comptesClients.put("DELETE /api/v1/clients/{clientId}/comptes/{numCompte}", "Supprimer compte");
        endpoints.put("Comptes Clients", comptesClients);
        
        // Opérations Clients
        Map<String, Object> operationsClients = new HashMap<>();
        operationsClients.put("POST /api/v1/clients/{clientId}/operations", "Effectuer opération");
        operationsClients.put("GET /api/v1/clients/{clientId}/operations/compte/{numCompte}", "Lister opérations");
        endpoints.put("Opérations Clients", operationsClients);
        
        docs.put("endpoints", endpoints);
        
        // Exemples de requêtes
        Map<String, Object> examples = new HashMap<>();
        
        Map<String, Object> loginExample = new HashMap<>();
        loginExample.put("method", "POST");
        loginExample.put("url", "/api/v1/auth/login");
        loginExample.put("body", Map.of(
            "username", "admin",
            "password", "admin123"
        ));
        examples.put("Login Admin", loginExample);
        
        Map<String, Object> createClientExample = new HashMap<>();
        createClientExample.put("method", "POST");
        createClientExample.put("url", "/api/v1/clients");
        createClientExample.put("body", Map.of(
            "nom", "Martin",
            "prenom", "Sophie",
            "email", "sophie.martin@email.com",
            "telephone", "0623456789",
            "adresse", "456 Avenue des Champs-Élysées, Paris",
            "dateNaissance", "1985-05-20",
            "password", "password456"
        ));
        examples.put("Création Client", createClientExample);
        
        docs.put("examples", examples);
        
        // Codes d'erreur
        Map<String, String> errorCodes = new HashMap<>();
        errorCodes.put("200", "Succès");
        errorCodes.put("201", "Créé avec succès");
        errorCodes.put("400", "Erreur de validation");
        errorCodes.put("401", "Non autorisé");
        errorCodes.put("404", "Non trouvé");
        errorCodes.put("500", "Erreur serveur");
        docs.put("errorCodes", errorCodes);
        
        return docs;
    }
    
    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("application", "EgaBank API");
        health.put("version", "1.0.0");
        return health;
    }
}
