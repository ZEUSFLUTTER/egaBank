# Architecture du Système EgaBank

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Angular                         │
│                  (Port 4200)                                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                        │
│                     (Port 8080)                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers (REST API)                   │  │
│  │  - ClientAuthController                              │  │
│  │  - ClientRestController                              │  │
│  │  - ClientCompteController                            │  │
│  │  - ClientOperationController                         │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │                  Services                             │  │
│  │  - ClientService                                      │  │
│  │  - CompteService                                      │  │
│  │  - OperationService                                   │  │
│  │  - EmailService                                       │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │               Repositories (JPA)                      │  │
│  │  - ClientRepository                                   │  │
│  │  - CompteBancaireRepository                          │  │
│  │  - OperationRepository                               │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │ JDBC
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│                   (Port 3306)                                │
│                                                              │
│  Tables:                                                     │
│  - client                                                    │
│  - compte_bancaire                                           │
│  - operation                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Flux d'authentification

```
Client                  Backend                 Database
  │                        │                        │
  │  1. POST /register     │                        │
  ├───────────────────────>│                        │
  │                        │  2. Hash password      │
  │                        │  3. Save client        │
  │                        ├───────────────────────>│
  │                        │  4. Client saved       │
  │                        │<───────────────────────┤
  │  5. Client created     │                        │
  │<───────────────────────┤                        │
  │                        │                        │
  │  6. POST /login        │                        │
  ├───────────────────────>│                        │
  │                        │  7. Find by email      │
  │                        ├───────────────────────>│
  │                        │  8. Client data        │
  │                        │<───────────────────────┤
  │                        │  9. Verify password    │
  │                        │ 10. Generate token     │
  │ 11. Token + user info  │                        │
  │<───────────────────────┤                        │
```

## Flux de création de compte bancaire

```
Client                  Backend                 Database
  │                        │                        │
  │  1. POST /comptes      │                        │
  ├───────────────────────>│                        │
  │                        │  2. Verify client      │
  │                        ├───────────────────────>│
  │                        │  3. Client exists      │
  │                        │<───────────────────────┤
  │                        │  4. Generate num       │
  │                        │  5. Create compte      │
  │                        ├───────────────────────>│
  │                        │  6. Compte saved       │
  │                        │<───────────────────────┤
  │  7. Compte created     │                        │
  │<───────────────────────┤                        │
```

## Flux d'opération bancaire (Dépôt)

```
Client                  Backend                 Database          Email
  │                        │                        │               │
  │  1. POST /operations   │                        │               │
  ├───────────────────────>│                        │               │
  │                        │  2. Find compte        │               │
  │                        ├───────────────────────>│               │
  │                        │  3. Compte data        │               │
  │                        │<───────────────────────┤               │
  │                        │  4. Update balance     │               │
  │                        ├───────────────────────>│               │
  │                        │  5. Create operation   │               │
  │                        ├───────────────────────>│               │
  │                        │  6. Send notification  │               │
  │                        ├───────────────────────────────────────>│
  │  7. Operation success  │                        │               │
  │<───────────────────────┤                        │               │
```

## Flux de virement

```
Client                  Backend                 Database          Email
  │                        │                        │               │
  │  1. POST /operations   │                        │               │
  │     (VIREMENT)         │                        │               │
  ├───────────────────────>│                        │               │
  │                        │  2. Find source        │               │
  │                        ├───────────────────────>│               │
  │                        │  3. Verify balance     │               │
  │                        │  4. Debit source       │               │
  │                        ├───────────────────────>│               │
  │                        │  5. Find destination   │               │
  │                        ├───────────────────────>│               │
  │                        │  6. Credit destination │               │
  │                        ├───────────────────────>│               │
  │                        │  7. Create operations  │               │
  │                        ├───────────────────────>│               │
  │                        │  8. Send notifications │               │
  │                        ├───────────────────────────────────────>│
  │  9. Virement success   │                        │               │
  │<───────────────────────┤                        │               │
```

## Modèle de données

```
┌─────────────────────────┐
│        Client           │
├─────────────────────────┤
│ id (PK)                 │
│ nom                     │
│ prenom                  │
│ birthday                │
│ sexe                    │
│ telephone (UNIQUE)      │
│ email (UNIQUE)          │
│ password (HASHED)       │
│ address                 │
│ nationalite             │
│ profession              │
│ pieceIdentite           │
│ numeroPiece             │
│ status (ENUM)           │
│ emailVerified           │
│ phoneVerified           │
│ createdAt               │
│ updatedAt               │
│ lastLoginAt             │
│ profileImageUrl         │
└────────┬────────────────┘
         │ 1
         │
         │ N
┌────────▼────────────────┐
│   CompteBancaire        │
├─────────────────────────┤
│ id (PK)                 │
│ numCompte (UNIQUE)      │
│ balance                 │
│ devis                   │
│ status (ENUM)           │
│ createdAt               │
│ client_id (FK)          │
│ type (DISCRIMINATOR)    │
└────────┬────────────────┘
         │ 1
         │
         │ N
┌────────▼────────────────┐
│      Operation          │
├─────────────────────────┤
│ id (PK)                 │
│ numOperation (UNIQUE)   │
│ amount                  │
│ dateOperation           │
│ typeOperation (ENUM)    │
│ compte_id (FK)          │
└─────────────────────────┘

┌─────────────────────────┐
│    CompteCourant        │
│  (extends Compte)       │
├─────────────────────────┤
│ decouvert               │
└─────────────────────────┘

┌─────────────────────────┐
│    CompteEpargne        │
│  (extends Compte)       │
├─────────────────────────┤
│ tauxInteret             │
└─────────────────────────┘
```

## Sécurité

```
┌─────────────────────────────────────────────────────────────┐
│                    Spring Security                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SecurityFilterChain                      │  │
│  │  - CSRF: Disabled                                     │  │
│  │  - CORS: Enabled                                      │  │
│  │  - Session: Stateless                                 │  │
│  │  - Public endpoints: /api/auth/**                     │  │
│  │  - Protected endpoints: /api/v1/**                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            PasswordEncoder (BCrypt)                   │  │
│  │  - Hash passwords on registration                     │  │
│  │  - Verify passwords on login                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technologies et dépendances

- **Spring Boot 4.0.1**: Framework principal
- **Spring Data JPA**: Accès aux données
- **Spring Security**: Authentification et autorisation
- **Spring Mail**: Notifications par email
- **MySQL Connector**: Driver JDBC
- **Lombok**: Réduction du code boilerplate
- **Jakarta Validation**: Validation des données
- **BCrypt**: Hashage des mots de passe

## Patterns utilisés

1. **MVC (Model-View-Controller)**: Séparation des responsabilités
2. **Repository Pattern**: Abstraction de l'accès aux données
3. **Service Layer**: Logique métier
4. **DTO (Data Transfer Object)**: Transfert de données
5. **Dependency Injection**: Couplage faible
6. **Strategy Pattern**: Héritage pour types de comptes
7. **Builder Pattern**: Construction d'objets complexes (LoginResponseDto)

## Évolutions futures possibles

1. **JWT Authentication**: Implémenter la génération de tokens JWT
2. **Refresh Tokens**: Gestion des tokens de rafraîchissement
3. **Role-Based Access Control**: Rôles et permissions
4. **Audit Trail**: Traçabilité des modifications
5. **File Upload**: Upload de pièces d'identité
6. **Two-Factor Authentication**: Authentification à deux facteurs
7. **API Rate Limiting**: Limitation du nombre de requêtes
8. **Caching**: Redis pour améliorer les performances
9. **Microservices**: Découpage en services indépendants
10. **Event-Driven Architecture**: Communication asynchrone
