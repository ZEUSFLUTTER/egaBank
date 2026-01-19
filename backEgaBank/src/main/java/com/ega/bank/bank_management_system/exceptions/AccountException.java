package com.ega.bank.bank_management_system.exceptions;

public class AccountException extends BankingException {
    
    public static final String ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND";
    public static final String ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED";
    public static final String INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE";
    public static final String INVALID_AMOUNT = "INVALID_AMOUNT";
    public static final String ACCOUNT_ALREADY_EXISTS = "ACCOUNT_ALREADY_EXISTS";
    public static final String INVALID_ACCOUNT_TYPE = "INVALID_ACCOUNT_TYPE";
    
    public AccountException(String errorCode, String userMessage, String adminMessage) {
        super(errorCode, userMessage, adminMessage);
    }
    
    public AccountException(String errorCode, String userMessage, String adminMessage, Object details) {
        super(errorCode, userMessage, adminMessage, details);
    }
    
    public static AccountException accountNotFound(String accountNumber) {
        return new AccountException(
            ACCOUNT_NOT_FOUND,
            "Le compte n'existe pas",
            "Compte non trouvé: " + accountNumber,
            accountNumber
        );
    }
    
    public static AccountException accountSuspended(String accountNumber) {
        return new AccountException(
            ACCOUNT_SUSPENDED,
            "Votre compte est suspendu. Veuillez contacter le service client.",
            "Compte suspendu: " + accountNumber,
            accountNumber
        );
    }
    
    public static AccountException insufficientBalance(double balance, double amount) {
        return new AccountException(
            INSUFFICIENT_BALANCE,
            "Solde insuffisant pour effectuer cette opération",
            String.format("Solde insuffisant: solde=%.2f, montant=%.2f", balance, amount),
            new Object[]{balance, amount}
        );
    }
    
    public static AccountException invalidAmount(double amount) {
        return new AccountException(
            INVALID_AMOUNT,
            "Le montant doit être positif",
            "Montant invalide: " + amount,
            amount
        );
    }
    
    public static AccountException accountAlreadyExists(String accountNumber) {
        return new AccountException(
            ACCOUNT_ALREADY_EXISTS,
            "Un compte avec ce numéro existe déjà",
            "Doublon de compte: " + accountNumber,
            accountNumber
        );
    }
    
    public static AccountException invalidAccountType(int type) {
        return new AccountException(
            INVALID_ACCOUNT_TYPE,
            "Type de compte non valide",
            "Type de compte invalide: " + type,
            type
        );
    }
}
