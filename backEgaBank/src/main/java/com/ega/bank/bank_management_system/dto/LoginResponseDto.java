package com.ega.bank.bank_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long clientId;
    private String email;
    private String fullName;
    private String status;
}
