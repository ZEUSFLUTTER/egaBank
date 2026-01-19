package com.ega.bank.bank_management_system.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ega.bank.bank_management_system.exceptions.BankingException;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    private String errorCode;
    private String message;
    private String userMessage;
    private String adminMessage;
    private Object details;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String path;
    private Integer status;
    
    public static ErrorResponseBuilder builder() {
        return new ErrorResponseBuilder()
            .timestamp(LocalDateTime.now())
            .status(500);
    }
    
    public static ErrorResponse fromBankingException(BankingException ex, String path, int status) {
        return ErrorResponse.builder()
            .errorCode(ex.getErrorCode())
            .message(ex.getAdminMessage())
            .userMessage(ex.getUserMessage())
            .adminMessage(ex.getAdminMessage())
            .details(ex.getDetails())
            .timestamp(LocalDateTime.now())
            .path(path)
            .status(status)
            .build();
    }
    
    public static ErrorResponse fromGenericException(Exception ex, String path, int status) {
        return ErrorResponse.builder()
            .errorCode("INTERNAL_ERROR")
            .message("Une erreur interne est survenue")
            .userMessage("Une erreur technique est survenue. Veuillez réessayer plus tard.")
            .adminMessage(ex.getMessage())
            .details(ex.getClass().getSimpleName())
            .timestamp(LocalDateTime.now())
            .path(path)
            .status(status)
            .build();
    }
}
