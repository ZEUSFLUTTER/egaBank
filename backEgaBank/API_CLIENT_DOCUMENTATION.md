# Documentation API Client - EgaBank

## Vue d'ensemble

Cette API permet aux clients de créer un compte, se connecter, gérer leurs comptes bancaires et effectuer des opérations bancaires.

## Endpoints disponibles

### 1. Authentification Client

#### Inscription d'un nouveau client
```
POST /api/auth/client/register
```

**Body:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "birthday": "1990-01-15",
  "sexe": "M",
  "telephone": "+221771234567",
  "email": "john.doe@example.com",
  "password": "MotDePasse123!",
  "confirmPassword": "MotDePasse123!",
  "address": "Dakar, Sénégal",
  "nationalite": "Sénégalaise",
  "profession": "Ingénieur",
  "pieceIdentite": "CNI",
  "numeroPiece": "1234567890123"
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "nom": "Doe",
  "prenom": "John",
  "email": "john.doe@example.com",
  "status": "PENDING",
  "createdAt": "2026-01-15T10:30:00"
}
```

#### Connexion client
```
POST /api/auth/client/login
```

**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "MotDePasse123!"
}
```

**Réponse (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "clientId": 1,
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "status": "ACTIVE"
}
```

### 2. Gestion des Clients

#### Obtenir tous les clients
```
GET /api/v1/clients
```

#### Obtenir un client par ID
```
GET /api/v1/clients/{id}
```

#### Obtenir un client par email
```
GET /api/v1/clients/email/{email}
```

#### Rechercher des clients
```
GET /api/v1/clients/search?keyword=john
```

#### Obtenir les clients par statut
```
GET /api/v1/clients/status/{status}
```
Statuts disponibles: `PENDING`, `ACTIVE`, `SUSPENDED`, `BLOCKED`, `CLOSED`

#### Mettre à jour un client
```
PUT /api/v1/clients/{id}
```

#### Mettre à jour le statut d'un client
```
PUT /api/v1/clients/{id}/status?status=ACTIVE
```

#### Supprimer un client
```
DELETE /api/v1/clients/{id}
```

### 3. Gestion des Comptes Bancaires

#### Obtenir tous les comptes d'un client
```
GET /api/v1/clients/{clientId}/comptes
```

**Réponse:**
```json
[
  {
    "id": 1,
    "numCompte": "CMEG A1.2 8895 1140 0271 e",
    "balance": 150000,
    "devis": "FCFA",
    "status": "ACTIVATED",
    "createdAt": "2026-01-15T10:30:00",
    "decouvert": 50000
  }
]
```

#### Créer un nouveau compte pour un client
```
POST /api/v1/clients/{clientId}/comptes
```

**Body pour Compte Courant:**
```json
{
  "typeCompte": 1,
  "balanceInitial": 50000,
  "devis": "FCFA",
  "decouvert": 10000
}
```

**Body pour Compte Épargne:**
```json
{
  "typeCompte": 2,
  "balanceInitial": 100000,
  "devis": "FCFA",
  "tauxInteret": 2.5
}
```

#### Supprimer un compte
```
DELETE /api/v1/clients/{clientId}/comptes/{numCompte}
```

### 4. Opérations Bancaires

#### Effectuer une opération
```
POST /api/v1/clients/{clientId}/operations
```

**Body pour Dépôt:**
```json
{
  "numCompte": "CMEG A1.2 8895 1140 0271 e",
  "amount": 50000,
  "typeOperation": "DEPOT",
  "description": "Dépôt en espèces"
}
```

**Body pour Retrait:**
```json
{
  "numCompte": "CMEG A1.2 8895 1140 0271 e",
  "amount": 20000,
  "typeOperation": "RETRAIT",
  "description": "Retrait DAB"
}
```

**Body pour Virement:**
```json
{
  "numCompte": "CMEG A1.2 8895 1140 0271 e",
  "amount": 30000,
  "typeOperation": "VIREMENT",
  "numCompteDestinataire": "CMEG A7.7 7611 7698 4732 7",
  "description": "Virement à un ami"
}
```

#### Obtenir les opérations d'un compte
```
GET /api/v1/clients/{clientId}/operations/compte/{numCompte}
```

**Réponse:**
```json
[
  {
    "id": 1,
    "numOperation": "OP1736934600000123",
    "amount": 50000,
    "dateOperation": "2026-01-15T10:30:00",
    "typeOperation": "DEPOT"
  },
  {
    "id": 2,
    "numOperation": "OP1736934700000456",
    "amount": 20000,
    "dateOperation": "2026-01-15T11:00:00",
    "typeOperation": "RETRAIT"
  }
]
```

## Types d'opérations

- `DEPOT` : Dépôt d'argent sur le compte
- `RETRAIT` : Retrait d'argent du compte
- `VIREMENT` : Transfert d'argent vers un autre compte
- `PAIEMENT` : Paiement de factures ou services
- `FRAIS` : Frais bancaires
- `INTERET` : Intérêts créditeurs

## Statuts des clients

- `PENDING` : En attente de validation
- `ACTIVE` : Compte actif
- `SUSPENDED` : Compte suspendu temporairement
- `BLOCKED` : Compte bloqué
- `CLOSED` : Compte fermé

## Statuts des comptes bancaires

- `ACTIVATED` : Compte actif
- `SUSPENDED` : Compte suspendu

## Codes d'erreur

- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

## Notes importantes

1. Les mots de passe doivent contenir au moins 8 caractères
2. Les emails et téléphones doivent être uniques
3. Un client doit avoir le statut `ACTIVE` pour se connecter
4. Les opérations ne peuvent être effectuées que sur des comptes `ACTIVATED`
5. Les retraits nécessitent un solde suffisant
6. Les virements débitent le compte source et créditent le compte destination
