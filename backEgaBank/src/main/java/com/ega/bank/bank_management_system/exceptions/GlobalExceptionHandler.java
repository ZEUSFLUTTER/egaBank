package com.ega.bank.bank_management_system.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.ega.bank.bank_management_system.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(BankingException.class)
    public ResponseEntity<ErrorResponse> handleBankingException(
            BankingException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.fromBankingException(
            ex, 
            request.getRequestURI(), 
            getHttpStatusForBankingException(ex).value()
        );
        
        return ResponseEntity
            .status(getHttpStatusForBankingException(ex))
            .body(errorResponse);
    }
    
    @ExceptionHandler(AccountException.class)
    public ResponseEntity<ErrorResponse> handleAccountException(
            AccountException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.fromBankingException(
            ex, 
            request.getRequestURI(), 
            getHttpStatusForAccountException(ex).value()
        );
        
        return ResponseEntity
            .status(getHttpStatusForAccountException(ex))
            .body(errorResponse);
    }
    
    @ExceptionHandler(ClientException.class)
    public ResponseEntity<ErrorResponse> handleClientException(
            ClientException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.fromBankingException(
            ex, 
            request.getRequestURI(), 
            getHttpStatusForClientException(ex).value()
        );
        
        return ResponseEntity
            .status(getHttpStatusForClientException(ex))
            .body(errorResponse);
    }
    
    @ExceptionHandler(OperationException.class)
    public ResponseEntity<ErrorResponse> handleOperationException(
            OperationException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.fromBankingException(
            ex, 
            request.getRequestURI(), 
            getHttpStatusForOperationException(ex).value()
        );
        
        return ResponseEntity
            .status(getHttpStatusForOperationException(ex))
            .body(errorResponse);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logError("Validation failed: " + errors, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("VALIDATION_ERROR")
            .message("Erreur de validation des données")
            .userMessage("Veuillez vérifier les informations saisies")
            .adminMessage("Validation failed: " + errors)
            .details(errors)
            .path(request.getRequestURI())
            .status(HttpStatus.BAD_REQUEST.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorResponse);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, HttpServletRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logError("Constraint violation: " + errors, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("CONSTRAINT_VIOLATION")
            .message("Violation des contraintes de données")
            .userMessage("Les données fournies ne respectent pas le format requis")
            .adminMessage("Constraint violation: " + errors)
            .details(errors)
            .path(request.getRequestURI())
            .status(HttpStatus.BAD_REQUEST.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorResponse);
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("AUTHENTICATION_FAILED")
            .message("Échec de l'authentification")
            .userMessage("Identifiants incorrects")
            .adminMessage("Authentication failed: " + ex.getMessage())
            .path(request.getRequestURI())
            .status(HttpStatus.UNAUTHORIZED.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(errorResponse);
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("BAD_CREDENTIALS")
            .message("Identifiants invalides")
            .userMessage("Email ou mot de passe incorrect")
            .adminMessage("Bad credentials: " + ex.getMessage())
            .path(request.getRequestURI())
            .status(HttpStatus.UNAUTHORIZED.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(errorResponse);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("ACCESS_DENIED")
            .message("Accès refusé")
            .userMessage("Vous n'avez pas les permissions nécessaires")
            .adminMessage("Access denied: " + ex.getMessage())
            .path(request.getRequestURI())
            .status(HttpStatus.FORBIDDEN.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(errorResponse);
    }
    
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .errorCode("ENDPOINT_NOT_FOUND")
            .message("Endpoint non trouvé")
            .userMessage("La ressource demandée n'existe pas")
            .adminMessage("No handler found: " + ex.getRequestURL())
            .path(request.getRequestURI())
            .status(HttpStatus.NOT_FOUND.value())
            .build();
        
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(errorResponse);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        
        logError(ex, request);
        
        ErrorResponse errorResponse = ErrorResponse.fromGenericException(
            ex, 
            request.getRequestURI(), 
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(errorResponse);
    }
    
    private void logError(Exception ex, HttpServletRequest request) {
        logger.error("Error in {}: {} - Method: {} - URI: {} - IP: {}", 
            ex.getClass().getSimpleName(),
            ex.getMessage(),
            request.getMethod(),
            request.getRequestURI(),
            getClientIpAddress(request),
            ex
        );
    }
    
    private void logError(String message, HttpServletRequest request) {
        logger.error("Validation Error - Method: {} - URI: {} - IP: {} - Message: {}", 
            request.getMethod(),
            request.getRequestURI(),
            getClientIpAddress(request),
            message
        );
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private HttpStatus getHttpStatusForBankingException(BankingException ex) {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    
    private HttpStatus getHttpStatusForAccountException(AccountException ex) {
        return switch (ex.getErrorCode()) {
            case AccountException.ACCOUNT_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case AccountException.ACCOUNT_SUSPENDED -> HttpStatus.FORBIDDEN;
            case AccountException.INSUFFICIENT_BALANCE -> HttpStatus.BAD_REQUEST;
            case AccountException.INVALID_AMOUNT -> HttpStatus.BAD_REQUEST;
            case AccountException.ACCOUNT_ALREADY_EXISTS -> HttpStatus.CONFLICT;
            case AccountException.INVALID_ACCOUNT_TYPE -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
    
    private HttpStatus getHttpStatusForClientException(ClientException ex) {
        return switch (ex.getErrorCode()) {
            case ClientException.CLIENT_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case ClientException.EMAIL_ALREADY_EXISTS -> HttpStatus.CONFLICT;
            case ClientException.PHONE_ALREADY_EXISTS -> HttpStatus.CONFLICT;
            case ClientException.INVALID_CREDENTIALS -> HttpStatus.UNAUTHORIZED;
            case ClientException.ACCOUNT_NOT_ACTIVE -> HttpStatus.FORBIDDEN;
            case ClientException.PASSWORD_MISMATCH -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
    
    private HttpStatus getHttpStatusForOperationException(OperationException ex) {
        return switch (ex.getErrorCode()) {
            case OperationException.OPERATION_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case OperationException.INVALID_OPERATION_TYPE -> HttpStatus.BAD_REQUEST;
            case OperationException.TRANSFER_FAILED -> HttpStatus.INTERNAL_SERVER_ERROR;
            case OperationException.SAME_ACCOUNT_TRANSFER -> HttpStatus.BAD_REQUEST;
            case OperationException.DAILY_LIMIT_EXCEEDED -> HttpStatus.BAD_REQUEST;
            case OperationException.TRANSFER_LIMIT_EXCEEDED -> HttpStatus.BAD_REQUEST;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}
