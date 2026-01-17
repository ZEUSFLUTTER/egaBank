# Guide d'utilisation - EgaBank

## Scénario complet d'utilisation

### 1. Inscription d'un nouveau client

**Endpoint:** `POST http://localhost:8080/api/auth/client/register`

**Exemple de requête:**
```json
{
  "nom": "Sow",
  "prenom": "Kossi",
  "birthday": "1992-03-10",
  "sexe": "M",
  "telephone": "+221775551234",
  "email": "kossi.sow@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "address": "Dakar, Almadies",
  "nationalite": "Sénégalaise",
  "profession": "Développeur",
  "pieceIdentite": "CNI",
  "numeroPiece": "1122334455667"
}
```

**Réponse attendue:**
```json
{
  "id": 3,
  "nom": "Sow",
  "prenom": "Kossi",
  "email": "kossi.sow@example.com",
  "telephone": "+221775551234",
  "status": "PENDING",
  "emailVerified": false,
  "phoneVerified": false,
  "createdAt": "2026-01-15T14:30:00"
}
```

**Note:** Le client est créé avec le statut `PENDING`. Un administrateur doit le passer à `ACTIVE` pour qu'il puisse se connecter.

### 2. Activation du compte par l'administrateur

**Endpoint:** `PUT http://localhost:8080/api/v1/clients/3/status?status=ACTIVE`

### 3. Connexion du client

**Endpoint:** `POST http://localhost:8080/api/auth/client/login`

**Requête:**
```json
{
  "email": "kossi.sow@example.com",
  "password": "SecurePass123!"
}
```

**Réponse:**
```json
{
  "token": "jwt-token-placeholder",
  "type": "Bearer",
  "clientId": 3,
  "email": "kossi.sow@example.com",
  "fullName": "Kossi Sow",
  "status": "ACTIVE"
}
```

### 4. Création d'un compte courant

**Endpoint:** `POST http://localhost:8080/api/v1/clients/3/comptes`

**Requête:**
```json
{
  "typeCompte": 1,
  "balanceInitial": 100000,
  "devis": "FCFA",
  "decouvert": 20000
}
```

**Réponse:**
```json
{
  "id": 4,
  "numCompte": "CMEG A5.8 1234 5678 9012 e",
  "balance": 100000,
  "devis": "FCFA",
  "status": "ACTIVATED",
  "createdAt": "2026-01-15T14:35:00",
  "decouvert": 20000
}
```

### 5. Création d'un compte épargne

**Endpoint:** `POST http://localhost:8080/api/v1/clients/3/comptes`

**Requête:**
```json
{
  "typeCompte": 2,
  "balanceInitial": 200000,
  "devis": "FCFA",
  "tauxInteret": 3.0
}
```

### 6. Consulter ses comptes

**Endpoint:** `GET http://localhost:8080/api/v1/clients/3/comptes`

**Réponse:**
```json
[
  {
    "id": 4,
    "numCompte": "CMEG A5.8 1234 5678 9012 e",
    "balance": 100000,
    "devis": "FCFA",
    "status": "ACTIVATED",
    "createdAt": "2026-01-15T14:35:00",
    "decouvert": 20000
  },
  {
    "id": 5,
    "numCompte": "CMEG A2.3 9876 5432 1098 e",
    "balance": 200000,
    "devis": "FCFA",
    "status": "ACTIVATED",
    "createdAt": "2026-01-15T14:36:00",
    "tauxInteret": 3.0
  }
]
```

### 7. Effectuer un dépôt

**Endpoint:** `POST http://localhost:8080/api/v1/clients/3/operations`

**Requête:**
```json
{
  "numCompte": "CMEG A5.8 1234 5678 9012 e",
  "amount": 50000,
  "typeOperation": "DEPOT",
  "description": "Dépôt en espèces"
}
```

**Réponse:**
```json
{
  "id": 4,
  "numOperation": "OP1736935000000234",
  "amount": 50000,
  "dateOperation": "2026-01-15T14:40:00",
  "typeOperation": "DEPOT"
}
```

**Nouveau solde:** 150 000 FCFA

### 8. Effectuer un retrait

**Endpoint:** `POST http://localhost:8080/api/v1/clients/3/operations`

**Requête:**
```json
{
  "numCompte": "CMEG A5.8 1234 5678 9012 e",
  "amount": 30000,
  "typeOperation": "RETRAIT",
  "description": "Retrait DAB"
}
```

**Nouveau solde:** 120 000 FCFA

### 9. Effectuer un virement

**Endpoint:** `POST http://localhost:8080/api/v1/clients/3/operations`

**Requête:**
```json
{
  "numCompte": "CMEG A5.8 1234 5678 9012 e",
  "amount": 25000,
  "typeOperation": "VIREMENT",
  "numCompteDestinataire": "CMEG A1.2 8895 1140 0271 e",
  "description": "Virement à Amadou"
}
```

**Résultat:**
- Compte source: 95 000 FCFA
- Compte destinataire: +25 000 FCFA

### 10. Consulter l'historique des opérations

**Endpoint:** `GET http://localhost:8080/api/v1/clients/3/operations/compte/CMEG A5.8 1234 5678 9012 e`

**Réponse:**
```json
[
  {
    "id": 4,
    "numOperation": "OP1736935000000234",
    "amount": 50000,
    "dateOperation": "2026-01-15T14:40:00",
    "typeOperation": "DEPOT"
  },
  {
    "id": 5,
    "numOperation": "OP1736935100000567",
    "amount": 30000,
    "dateOperation": "2026-01-15T14:42:00",
    "typeOperation": "RETRAIT"
  },
  {
    "id": 6,
    "numOperation": "OP1736935200000890",
    "amount": 25000,
    "dateOperation": "2026-01-15T14:45:00",
    "typeOperation": "VIREMENT"
  }
]
```

## Cas d'erreur courants

### 1. Email déjà utilisé
```json
{
  "message": "Un compte avec cet email existe déjà"
}
```

### 2. Mot de passe incorrect
```json
{
  "message": "Email ou mot de passe incorrect"
}
```

### 3. Compte non actif
```json
{
  "message": "Votre compte n'est pas actif. Statut: PENDING"
}
```

### 4. Solde insuffisant
```json
{
  "message": "Solde insuffisant"
}
```

### 5. Compte suspendu
```json
{
  "message": "Le compte est suspendu"
}
```

## Tester avec Postman ou cURL

### Exemple avec cURL

**Inscription:**
```bash
curl -X POST http://localhost:8080/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Sow",
    "prenom": "Kossi",
    "birthday": "1992-03-10",
    "sexe": "M",
    "telephone": "+221775551234",
    "email": "kossi.sow@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "address": "Dakar, Almadies",
    "nationalite": "Sénégalaise"
  }'
```

**Connexion:**
```bash
curl -X POST http://localhost:8080/api/auth/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kossi.sow@example.com",
    "password": "SecurePass123!"
  }'
```

## Notifications par email

Le système envoie automatiquement des emails pour :
- Chaque dépôt effectué
- Chaque retrait effectué
- Chaque virement effectué

Les emails contiennent :
- Le type d'opération
- Le montant
- Le numéro de compte
- Le nouveau solde

## Conseils de sécurité

1. Utilisez des mots de passe forts (minimum 8 caractères)
2. Ne partagez jamais vos identifiants
3. Vérifiez toujours le solde avant une opération
4. Conservez les numéros d'opération pour référence
