package com.ega.bank.bank_management_system.exceptions;

public class OperationException extends BankingException {
    
    public static final String OPERATION_NOT_FOUND = "OPERATION_NOT_FOUND";
    public static final String INVALID_OPERATION_TYPE = "INVALID_OPERATION_TYPE";
    public static final String TRANSFER_FAILED = "TRANSFER_FAILED";
    public static final String SAME_ACCOUNT_TRANSFER = "SAME_ACCOUNT_TRANSFER";
    public static final String DAILY_LIMIT_EXCEEDED = "DAILY_LIMIT_EXCEEDED";
    public static final String TRANSFER_LIMIT_EXCEEDED = "TRANSFER_LIMIT_EXCEEDED";
    
    public OperationException(String errorCode, String userMessage, String adminMessage) {
        super(errorCode, userMessage, adminMessage);
    }
    
    public OperationException(String errorCode, String userMessage, String adminMessage, Object details) {
        super(errorCode, userMessage, adminMessage, details);
    }
    
    public static OperationException operationNotFound(Long operationId) {
        return new OperationException(
            OPERATION_NOT_FOUND,
            "Opération non trouvée",
            "Opération non trouvée avec l'ID: " + operationId,
            operationId
        );
    }
    
    public static OperationException invalidOperationType(String type) {
        return new OperationException(
            INVALID_OPERATION_TYPE,
            "Type d'opération non valide",
            "Type d'opération invalide: " + type,
            type
        );
    }
    
    public static OperationException transferFailed(String reason) {
        return new OperationException(
            TRANSFER_FAILED,
            "Le virement a échoué. Veuillez réessayer.",
            "Échec du virement: " + reason,
            reason
        );
    }
    
    public static OperationException sameAccountTransfer() {
        return new OperationException(
            SAME_ACCOUNT_TRANSFER,
            "Impossible d'effectuer un virement vers le même compte",
            "Tentative de virement vers le même compte"
        );
    }
    
    public static OperationException dailyLimitExceeded(double amount, double limit) {
        return new OperationException(
            DAILY_LIMIT_EXCEEDED,
            "Limite journalière dépassée",
            String.format("Limite journalière dépassée: montant=%.2f, limite=%.2f", amount, limit),
            new Object[]{amount, limit}
        );
    }
    
    public static OperationException transferLimitExceeded(double amount, double limit) {
        return new OperationException(
            TRANSFER_LIMIT_EXCEEDED,
            "Limite de virement dépassée",
            String.format("Limite de virement dépassée: montant=%.2f, limite=%.2f", amount, limit),
            new Object[]{amount, limit}
        );
    }
}
