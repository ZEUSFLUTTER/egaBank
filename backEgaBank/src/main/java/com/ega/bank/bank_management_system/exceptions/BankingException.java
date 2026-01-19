package com.ega.bank.bank_management_system.exceptions;

public class BankingException extends RuntimeException {
    
    private final String errorCode;
    private final String userMessage;
    private final String adminMessage;
    private final Object details;
    
    public BankingException(String errorCode, String userMessage, String adminMessage) {
        super(adminMessage);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.adminMessage = adminMessage;
        this.details = null;
    }
    
    public BankingException(String errorCode, String userMessage, String adminMessage, Object details) {
        super(adminMessage);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.adminMessage = adminMessage;
        this.details = details;
    }
    
    public BankingException(String errorCode, String userMessage, String adminMessage, Throwable cause) {
        super(adminMessage, cause);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.adminMessage = adminMessage;
        this.details = null;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public String getUserMessage() {
        return userMessage;
    }
    
    public String getAdminMessage() {
        return adminMessage;
    }
    
    public Object getDetails() {
        return details;
    }
}
