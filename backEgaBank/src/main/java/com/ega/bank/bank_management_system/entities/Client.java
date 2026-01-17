package com.ega.bank.bank_management_system.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import com.ega.bank.bank_management_system.enums.ClientStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Client implements Serializable{
    
    @Id  
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String prenom;
    
    @JsonFormat(pattern="yyyy-MM-dd")
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birthday;
    
    @Pattern(regexp = "^(M|F|Autre)$", message = "Le sexe doit être M, F ou Autre")
    @Column(length = 10)
    private String sexe;
    
    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Format de téléphone invalide")
    @Column(nullable = false, unique = true, length = 20)
    private String telephone;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    @Size(max = 200, message = "L'adresse ne peut pas dépasser 200 caractères")
    @Column(length = 200)
    private String address;
    
    @Size(max = 50, message = "La nationalité ne peut pas dépasser 50 caractères")
    @Column(length = 50)
    private String nationalite;
    
    @Column(length = 50)
    private String profession;
    
    @Column(length = 50)
    private String pieceIdentite;
    
    @Column(length = 50)
    private String numeroPiece;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClientStatus status = ClientStatus.PENDING;
    
    @Column(nullable = false)
    private Boolean emailVerified = false;
    
    @Column(nullable = false)
    private Boolean phoneVerified = false;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLoginAt;
    
    @Column(length = 500)
    private String profileImageUrl;
    
    @JsonBackReference
    @OneToMany(mappedBy="client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<CompteBancaire> comptes = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
    public String getFullName() {
        return prenom + " " + nom;
    }
}
