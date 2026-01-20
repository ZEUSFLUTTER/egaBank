# 📋 Champs Requis pour Tests API - EgaBank

## 🎯 Guide Complet des Champs par Endpoint

Ce document détaille tous les champs requis pour chaque test API avec exemples et validations.

---

## 🔐 **AUTHENTIFICATION**

### **1. Connexion Administrateur**
**Endpoint**: `POST /api/v1/auth/login`

#### Champs Requis:
```json
{
  "username": "admin",           // 👤 Nom d'utilisateur (obligatoire)
  "password": "admin123"        // 🔐 Mot de passe (obligatoire)
}
```

#### Validation:
- `username`: Chaîne de caractères, non vide
- `password`: Chaîne de caractères, minimum 6 caractères

---

### **2. Inscription Client**
**Endpoint**: `POST /api/auth/client/register`

#### Champs Requis:
```json
{
  "nom": "Martin",                    // 👤 Nom (obligatoire, non vide)
  "prenom": "Sophie",                 // 👤 Prénom (obligatoire, non vide)
  "email": "sophie.martin@email.com",  // 📧 Email (obligatoire, format valide)
  "telephone": "0623456789",          // 📱 Téléphone (obligatoire, format français)
  "adresse": "456 Avenue des Champs-Élysées, Paris",  // 🏠 Adresse (obligatoire)
  "dateNaissance": "1985-05-20",      // 📅 Date naissance (obligatoire, format YYYY-MM-DD)
  "password": "password456",           // 🔐 Mot de passe (obligatoire, min 6 caractères)
  "nationalite": "Française"           // 🌍 Nationalité (optionnel)
}
```

#### Validation:
- `nom`: Chaîne 2-50 caractères, lettres uniquement
- `prenom`: Chaîne 2-50 caractères, lettres uniquement  
- `email`: Format email valide, unique
- `telephone`: Format français (06/07 + 8 chiffres), unique
- `adresse`: Chaîne 5-200 caractères
- `dateNaissance`: Date valide, âge minimum 18 ans
- `password`: Minimum 6 caractères, au moins 1 chiffre

---

### **3. Connexion Client**
**Endpoint**: `POST /api/auth/client/login`

#### Champs Requis:
```json
{
  "email": "sophie.martin@email.com",  // 📧 Email (obligatoire, existe en BDD)
  "password": "password456"           // 🔐 Mot de passe (obligatoire)
}
```

---

## 👥 **GESTION DES CLIENTS**

### **4. Créer un Client**
**Endpoint**: `POST /api/v1/clients`

#### Champs Requis:
```json
{
  "nom": "Durand",                    // 👤 Nom (obligatoire)
  "prenom": "Pierre",                 // 👤 Prénom (obligatoire)
  "email": "pierre.durand@email.com",  // 📧 Email (obligatoire, unique)
  "telephone": "0712345678",          // 📱 Téléphone (obligatoire, unique)
  "adresse": "123 Rue de la République, Lyon",  // 🏠 Adresse (obligatoire)
  "dateNaissance": "1990-03-15",      // 📅 Date naissance (obligatoire)
  "password": "securepass123",          // 🔐 Mot de passe (obligatoire)
  "nationalite": "Française"           // 🌍 Nationalité (optionnel)
}
```

---

### **5. Mettre à Jour un Client**
**Endpoint**: `PUT /api/v1/clients/{id}`

#### Paramètre URL:
- `id`: ID numérique du client (ex: `1`)

#### Champs Requis:
```json
{
  "nom": "Durand",                    // 👤 Nom (obligatoire)
  "prenom": "Pierre",                 // 👤 Prénom (obligatoire)
  "email": "pierre.durand@email.com",  // 📧 Email (obligatoire)
  "telephone": "0712345678",          // 📱 Téléphone (obligatoire)
  "adresse": "123 Rue de la République, Lyon",  // 🏠 Adresse (obligatoire)
  "dateNaissance": "1990-03-15",      // 📅 Date naissance (obligatoire)
  "nationalite": "Française"           // 🌍 Nationalité (optionnel)
}
```

---

### **6. Mise à Jour Partielle**
**Endpoint**: `PATCH /api/v1/clients/{id}`

#### Paramètre URL:
- `id`: ID numérique du client

#### Champs Optionnels (un ou plusieurs):
```json
{
  "nom": "Durand",                    // 👤 Nom
  "prenom": "Pierre",                 // 👤 Prénom
  "email": "nouveau@email.com",        // 📧 Email
  "telephone": "0712345678",          // 📱 Téléphone
  "adresse": "Nouvelle adresse",        // 🏠 Adresse
  "nationalite": "Belge"              // 🌍 Nationalité
}
```

---

### **7. Rechercher des Clients**
**Endpoint**: `GET /api/v1/clients/search`

#### Paramètre Query:
- `keyword`: Mot-clé de recherche (ex: `Martin`)

#### Exemple:
```
GET /api/v1/clients/search?keyword=Martin
```

---

### **8. Filtrer par Statut**
**Endpoint**: `GET /api/v1/clients/status/{status}`

#### Paramètre URL:
- `status`: Statut du client
  - `ACTIVE` ✅
  - `INACTIVE` ❌
  - `SUSPENDED` ⏸️

#### Exemple:
```
GET /api/v1/clients/status/ACTIVE
```

---

### **9. Vérifier Email**
**Endpoint**: `GET /api/v1/clients/exists/email`

#### Paramètre Query:
- `email`: Email à vérifier

#### Exemple:
```
GET /api/v1/clients/exists/email?email=test@example.com
```

---

### **10. Vérifier Téléphone**
**Endpoint**: `GET /api/v1/clients/exists/telephone`

#### Paramètre Query:
- `telephone`: Téléphone à vérifier

#### Exemple:
```
GET /api/v1/clients/exists/telephone?telephone=0612345678
```

---

## 🏦 **GESTION DES COMPTES**

### **11. Créer un Compte**
**Endpoint**: `POST /api/v1/comptes`

#### Champs Requis:
```json
{
  "type": "CC",                      // 🏦 Type: "CC" (Courant) ou "CE" (Épargne)
  "clientId": 1,                      // 👤 ID client (obligatoire, existe en BDD)
  "tauxInteret": 0.03,               // 📈 Taux intérêt (optionnel, pour CE)
  "decouvert": 500.00                 // 💳 Découvert autorisé (optionnel, pour CC)
}
```

---

### **12. Lister Comptes par Type**
**Endpoint**: `GET /api/v1/comptes/type/{type}`

#### Paramètre URL:
- `type`: Type de compte (`CC` ou `CE`)

#### Exemple:
```
GET /api/v1/comptes/type/CC
```

---

### **13. Obtenir un Compte**
**Endpoint**: `GET /api/v1/comptes/{numCompte}/{type}`

#### Paramètres URL:
- `numCompte`: Numéro de compte (ex: `CC123456`)
- `type`: Type de compte (`CC` ou `CE`)

#### Exemple:
```
GET /api/v1/comptes/CC123456/CC
```

---

## 💰 **GESTION DES OPÉRATIONS**

### **14. Versement**
**Endpoint**: `POST /api/v1/operations/versement`

#### Champs Requis:
```json
{
  "numCompte": "CC123456",          // 🏦 Numéro compte (obligatoire)
  "amount": 1000.00,                // 💰 Montant (obligatoire, > 0)
  "description": "Salaire mensuel"    // 📝 Description (optionnelle)
}
```

---

### **15. Retrait**
**Endpoint**: `POST /api/v1/operations/retrait`

#### Champs Requis:
```json
{
  "numCompte": "CC123456",          // 🏦 Numéro compte (obligatoire)
  "amount": 200.00,                 // 💰 Montant (obligatoire, > 0)
  "description": "Retrait DAB"        // 📝 Description (optionnelle)
}
```

---

### **16. Virement**
**Endpoint**: `POST /api/v1/operations/virement`

#### Champs Requis:
```json
{
  "numCompteSource": "CC123456",      // 🏦 Compte source (obligatoire)
  "numCompteDestination": "CE789012",  // 🏦 Compte destination (obligatoire)
  "amount": 500.00,                  // 💰 Montant (obligatoire, > 0)
  "description": "Virement épargne"     // 📝 Description (optionnelle)
}
```

---

### **17. Lister Opérations Client**
**Endpoint**: `GET /api/v1/operations/client/{numCompte}`

#### Paramètre URL:
- `numCompte`: Numéro de compte

#### Exemple:
```
GET /api/v1/operations/client/CC123456
```

---

## 📊 **DASHBOARD**

### **18. Statistiques Dashboard**
**Endpoint**: `GET /api/v1/dashboard/stats`

#### Champs: Aucun (requête GET simple)

#### Exemple:
```
GET /api/v1/dashboard/stats
```

---

## 🔗 **COMPTES CLIENTS**

### **19. Lister Comptes d'un Client**
**Endpoint**: `GET /api/v1/clients/{clientId}/comptes`

#### Paramètre URL:
- `clientId`: ID du client

#### Exemple:
```
GET /api/v1/clients/1/comptes
```

---

### **20. Créer Compte pour un Client**
**Endpoint**: `POST /api/v1/clients/{clientId}/comptes`

#### Paramètre URL:
- `clientId`: ID du client

#### Champs Requis:
```json
{
  "type": "CC",                      // 🏦 Type: "CC" ou "CE"
  "tauxInteret": 0.03,               // 📈 Taux intérêt (pour CE)
  "decouvert": 500.00                 // 💳 Découvert (pour CC)
}
```

---

### **21. Supprimer Compte Client**
**Endpoint**: `DELETE /api/v1/clients/{clientId}/comptes/{numCompte}`

#### Paramètres URL:
- `clientId`: ID du client
- `numCompte`: Numéro de compte

#### Exemple:
```
DELETE /api/v1/clients/1/comptes/CC123456
```

---

## 🔄 **OPÉRATIONS CLIENTS**

### **22. Effectuer Opération Client**
**Endpoint**: `POST /api/v1/clients/{clientId}/operations`

#### Paramètre URL:
- `clientId`: ID du client

#### Champs Requis:
```json
{
  "numCompteSource": "CC123456",      // 🏦 Compte source
  "numCompteDestination": "CE789012",  // 🏦 Compte destination
  "amount": 300.00,                  // 💰 Montant
  "type": "VIREMENT",                 // 🔄 Type: "VERSEMENT", "RETRAIT", "VIREMENT"
  "description": "Virement mensuel"     // 📝 Description
}
```

---

### **23. Lister Opérations Client par Compte**
**Endpoint**: `GET /api/v1/clients/{clientId}/operations/compte/{numCompte}`

#### Paramètres URL:
- `clientId`: ID du client
- `numCompte`: Numéro de compte

#### Exemple:
```
GET /api/v1/clients/1/operations/compte/CC123456
```

---

## 📝 **RÈGLES DE VALIDATION**

### **Formats Acceptés**
- **Email**: `nom@domaine.extension`
- **Téléphone**: `06XXXXXXXX` ou `07XXXXXXXX` (10 chiffres)
- **Date**: `YYYY-MM-DD` (ISO 8601)
- **Montant**: Numérique avec 2 décimales maximum
- **ID**: Numérique entier positif

### **Contraintes**
- **Email**: Unique dans toute la base de données
- **Téléphone**: Unique dans toute la base de données
- **Âge**: Minimum 18 ans pour l'inscription
- **Montant**: Doit être supérieur à 0
- **Compte**: Le compte doit exister pour les opérations

### **Codes d'Erreur**
- `200`: Succès
- `201`: Créé avec succès
- `400`: Erreur de validation
- `401`: Non autorisé
- `404`: Ressource non trouvée
- `500`: Erreur serveur interne

---

## 🧪 **GUIDE DE TEST RAPIDE**

### **1. Préparation**
```bash
# Démarrer le backend
cd backEgaBank
mvn spring-boot:run
```

### **2. Tests Essentiels**
```bash
# 1. Connexion admin
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Inscription client
curl -X POST http://localhost:8080/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Martin","prenom":"Sophie","email":"sophie.martin@email.com","telephone":"0623456789","adresse":"456 Avenue des Champs-Élysées, Paris","dateNaissance":"1985-05-20","password":"password456"}'

# 3. Créer compte
curl -X POST http://localhost:8080/api/v1/comptes \
  -H "Content-Type: application/json" \
  -d '{"type":"CC","clientId":1,"decouvert":500.00}'

# 4. Versement
curl -X POST http://localhost:8080/api/v1/operations/versement \
  -H "Content-Type: application/json" \
  -d '{"numCompte":"CC123456","amount":1000.00,"description":"Salaire"}'
```

### **3. Vérification**
```bash
# Vérifier la documentation
curl http://localhost:8080/api/docs

# Vérifier le statut
curl http://localhost:8080/api/docs/health

# Interface HTML
# Ouvrir: http://localhost:8080/api-docs.html
```

---

## 📞 **SUPPORT**

Pour toute question sur les champs requis ou les tests:
1. Consultez la documentation interactive: http://localhost:8080/api-docs.html
2. Vérifiez les logs de l'application
3. Contactez l'équipe de développement EgaBank

---

*Ce document est votre référence complète pour tous les tests API de l'application EgaBank.*
