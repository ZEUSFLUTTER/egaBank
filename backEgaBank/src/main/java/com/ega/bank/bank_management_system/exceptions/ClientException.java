package com.ega.bank.bank_management_system.exceptions;

public class ClientException extends BankingException {
    
    public static final String CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND";
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String PHONE_ALREADY_EXISTS = "PHONE_ALREADY_EXISTS";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String ACCOUNT_NOT_ACTIVE = "ACCOUNT_NOT_ACTIVE";
    public static final String PASSWORD_MISMATCH = "PASSWORD_MISMATCH";
    
    public ClientException(String errorCode, String userMessage, String adminMessage) {
        super(errorCode, userMessage, adminMessage);
    }
    
    public ClientException(String errorCode, String userMessage, String adminMessage, Object details) {
        super(errorCode, userMessage, adminMessage, details);
    }
    
    public static ClientException clientNotFound(Long clientId) {
        return new ClientException(
            CLIENT_NOT_FOUND,
            "Client non trouvé",
            "Client non trouvé avec l'ID: " + clientId,
            clientId
        );
    }
    
    public static ClientException clientNotFound(String email) {
        return new ClientException(
            CLIENT_NOT_FOUND,
            "Client non trouvé",
            "Client non trouvé avec l'email: " + email,
            email
        );
    }
    
    public static ClientException emailAlreadyExists(String email) {
        return new ClientException(
            EMAIL_ALREADY_EXISTS,
            "Un compte avec cet email existe déjà",
            "Email déjà utilisé: " + email,
            email
        );
    }
    
    public static ClientException phoneAlreadyExists(String phone) {
        return new ClientException(
            PHONE_ALREADY_EXISTS,
            "Un compte avec ce numéro de téléphone existe déjà",
            "Téléphone déjà utilisé: " + phone,
            phone
        );
    }
    
    public static ClientException invalidCredentials() {
        return new ClientException(
            INVALID_CREDENTIALS,
            "Email ou mot de passe incorrect",
            "Tentative de connexion avec des identifiants invalides"
        );
    }
    
    public static ClientException accountNotActive(String status) {
        return new ClientException(
            ACCOUNT_NOT_ACTIVE,
            "Votre compte n'est pas actif. Veuillez contacter le service client.",
            "Compte non actif. Statut: " + status,
            status
        );
    }
    
    public static ClientException passwordMismatch() {
        return new ClientException(
            PASSWORD_MISMATCH,
            "Les mots de passe ne correspondent pas",
            "Confirmation de mot de passe invalide"
        );
    }
}
