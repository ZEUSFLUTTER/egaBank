# Tests API Complets - EgaBank

Ce document contient tous les tests API pour l'application EgaBank. Les tests couvrent tous les endpoints disponibles dans les contrôleurs Spring Boot.

## Table des matières

1. [Authentification Admin](#authentification-admin)
2. [Authentification Client](#authentification-client)
3. [Gestion des Clients](#gestion-des-clients)
4. [Gestion des Comptes Bancaires](#gestion-des-comptes-bancaires)
5. [Gestion des Opérations](#gestion-des-opérations)
6. [Dashboard](#dashboard)
7. [Comptes Clients](#comptes-clients)
8. [Opérations Clients](#opérations-clients)

---

## Authentification Admin

### Base URL: `http://localhost:8080/api/v1/auth`

#### 1. Login Admin
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

**Réponse attendue (200 OK):**
```json
{
    "id": 1,
    "username": "admin",
    "password": null,
    "email": "admin@egabank.com",
    "role": "ADMIN"
}
```

**Réponse erreur (401 Unauthorized):**
```json
"Identifiants incorrects"
```

---

## Authentification Client

### Base URL: `http://localhost:8080/api/auth/client`

#### 1. Register Client
```http
POST /api/auth/client/register
Content-Type: application/json

{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "telephone": "0612345678",
    "adresse": "123 Rue de la République, Paris",
    "dateNaissance": "1990-01-15",
    "password": "password123"
}
```

**Réponse attendue (201 Created):**
```json
{
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com",
    "telephone": "0612345678",
    "adresse": "123 Rue de la République, Paris",
    "dateNaissance": "1990-01-15",
    "status": "ACTIVE",
    "dateCreation": "2024-01-15T10:30:00"
}
```

#### 2. Login Client
```http
POST /api/auth/client/login
Content-Type: application/json

{
    "email": "jean.dupont@email.com",
    "password": "password123"
}
```

**Réponse attendue (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "client": {
        "id": 1,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@email.com"
    }
}
```

---

## Gestion des Clients

### Base URL: `http://localhost:8080/api/v1/clients`

#### 1. Créer un Client
```http
POST /api/v1/clients
Content-Type: application/json

{
    "nom": "Martin",
    "prenom": "Sophie",
    "email": "sophie.martin@email.com",
    "telephone": "0623456789",
    "adresse": "456 Avenue des Champs-Élysées, Paris",
    "dateNaissance": "1985-05-20",
    "password": "password456"
}
```

#### 2. Lister tous les Clients
```http
GET /api/v1/clients
```

#### 3. Obtenir un Client par ID
```http
GET /api/v1/clients/1
```

#### 4. Chercher un Client par Email
```http
GET /api/v1/clients/email/sophie.martin@email.com
```

#### 5. Rechercher des Clients
```http
GET /api/v1/clients/search?keyword=Martin
```

#### 6. Lister les Clients par Statut
```http
GET /api/v1/clients/status/ACTIVE
```

#### 7. Mettre à jour un Client (PUT)
```http
PUT /api/v1/clients/1
Content-Type: application/json

{
    "nom": "Martin",
    "prenom": "Sophie",
    "email": "sophie.martin@email.com",
    "telephone": "0623456789",
    "adresse": "789 Boulevard Saint-Germain, Paris",
    "dateNaissance": "1985-05-20"
}
```

#### 8. Mettre à jour partiellement un Client (PATCH)
```http
PATCH /api/v1/clients/1
Content-Type: application/json

{
    "adresse": "789 Boulevard Saint-Germain, Paris"
}
```

#### 9. Mettre à jour le Statut d'un Client
```http
PUT /api/v1/clients/1/status?status=SUSPENDED
```

#### 10. Activer un Client
```http
PATCH /api/v1/clients/1/activate
```

#### 11. Supprimer un Client
```http
DELETE /api/v1/clients/1
```

#### 12. Vérifier si un Email existe
```http
GET /api/v1/clients/exists/email?email=test@email.com
```

#### 13. Vérifier si un Téléphone existe
```http
GET /api/v1/clients/exists/telephone?telephone=0612345678
```

---

## Gestion des Comptes Bancaires

### Base URL: `http://localhost:8080/api/v1`

#### 1. Créer un Compte
```http
POST /api/v1/comptes
Content-Type: application/json

{
    "solde": 1000.0,
    "clientId": 1,
    "type": "CC"
}
```

#### 2. Lister les Comptes Courants
```http
GET /api/v1/comptes/type/CC
```

#### 3. Lister les Comptes Épargne
```http
GET /api/v1/comptes/type/CE
```

#### 4. Obtenir un Compte par Numéro
```http
GET /api/v1/comptes/CC123456/CC
```

#### 5. Activer un Compte
```http
PUT /api/v1/comptes/active/CC123456
```

#### 6. Suspendre un Compte
```http
PUT /api/v1/comptes/suspendre/CC123456
```

---

## Gestion des Opérations

### Base URL: `http://localhost:8080/api/v1`

#### 1. Effectuer un Versement
```http
POST /api/v1/operations/versement
Content-Type: application/json

{
    "numCompte": "CC123456",
    "amount": 500.0,
    "description": "Versement initial"
}
```

#### 2. Effectuer un Retrait
```http
POST /api/v1/operations/retrait
Content-Type: application/json

{
    "numCompte": "CC123456",
    "amount": 200.0,
    "description": "Retrait ATM"
}
```

#### 3. Effectuer un Virement
```http
POST /api/v1/operations/virement
Content-Type: application/json

{
    "numCompteSource": "CC123456",
    "numCompteDestination": "CE789012",
    "amount": 300.0,
    "description": "Virement vers épargne"
}
```

#### 4. Test Endpoint
```http
GET /api/v1/operations/test
```

#### 5. Test Virement
```http
POST /api/v1/operations/virement-test
Content-Type: application/json

{
    "numCompteSource": "CC123456",
    "numCompteDestination": "CE789012",
    "amount": 100.0
}
```

#### 6. Lister les Opérations d'un Client
```http
GET /api/v1/operations/client/CC123456
```

---

## Dashboard

### Base URL: `http://localhost:8080/api/v1/dashboard`

#### 1. Obtenir les Statistiques
```http
GET /api/v1/dashboard/stats
```

**Réponse attendue:**
```json
{
    "totalClients": 150,
    "totalComptes": 320,
    "totalOperations": 1250,
    "soldeTotal": 2500000.50,
    "clientsActifs": 142,
    "comptesActifs": 310
}
```

---

## Comptes Clients

### Base URL: `http://localhost:8080/api/v1/clients/{clientId}/comptes`

#### 1. Lister les Comptes d'un Client
```http
GET /api/v1/clients/1/comptes
```

#### 2. Créer un Compte pour un Client
```http
POST /api/v1/clients/1/comptes
Content-Type: application/json

{
    "solde": 2000.0,
    "type": "CE"
}
```

#### 3. Supprimer un Compte
```http
DELETE /api/v1/clients/1/comptes/CC123456
```

---

## Opérations Clients

### Base URL: `http://localhost:8080/api/v1/clients/{clientId}/operations`

#### 1. Effectuer une Opération
```http
POST /api/v1/clients/1/operations
Content-Type: application/json

{
    "numCompte": "CC123456",
    "amount": 150.0,
    "type": "VERSEMENT",
    "description": "Dépôt salaire"
}
```

#### 2. Lister les Opérations par Compte
```http
GET /api/v1/clients/1/operations/compte/CC123456
```

---

## Scripts de Test Automatisés

### Collection Postman

Vous pouvez importer cette collection Postman pour tester rapidement tous les endpoints:

```json
{
    "info": {
        "name": "EgaBank API Tests",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Authentification",
            "item": [
                {
                    "name": "Login Admin",
                    "request": {
                        "method": "POST",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"username\": \"admin\",\n    \"password\": \"admin123\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/v1/auth/login",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "v1", "auth", "login"]
                        }
                    }
                }
            ]
        }
    ],
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8080"
        }
    ]
}
```

### Script Bash pour Tests Rapides

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== Test Authentification Admin ==="
curl -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

echo -e "\n\n=== Test Dashboard Stats ==="
curl -X GET "$BASE_URL/api/v1/dashboard/stats"

echo -e "\n\n=== Test Lister Clients ==="
curl -X GET "$BASE_URL/api/v1/clients"

echo -e "\n\n=== Test Créer Client ==="
curl -X POST "$BASE_URL/api/v1/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@example.com",
    "telephone": "0612345678",
    "adresse": "Test Address",
    "dateNaissance": "1990-01-01",
    "password": "password123"
  }'

echo -e "\n\n=== Tests terminés ==="
```

### Script Python pour Tests Automatisés

```python
import requests
import json

BASE_URL = "http://localhost:8080"

class EgaBankAPITest:
    def __init__(self):
        self.base_url = BASE_URL
        self.auth_token = None
    
    def test_admin_login(self):
        """Test login admin"""
        url = f"{self.base_url}/api/v1/auth/login"
        data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(url, json=data)
        print(f"Admin Login Status: {response.status_code}")
        return response.json()
    
    def test_create_client(self):
        """Test création client"""
        url = f"{self.base_url}/api/v1/clients"
        data = {
            "nom": "Python",
            "prenom": "Test",
            "email": "python@test.com",
            "telephone": "0698765432",
            "adresse": "Python Test Address",
            "dateNaissance": "1992-12-12",
            "password": "testpass"
        }
        response = requests.post(url, json=data)
        print(f"Create Client Status: {response.status_code}")
        return response.json()
    
    def test_dashboard_stats(self):
        """Test dashboard stats"""
        url = f"{self.base_url}/api/v1/dashboard/stats"
        response = requests.get(url)
        print(f"Dashboard Stats Status: {response.status_code}")
        return response.json()
    
    def run_all_tests(self):
        """Exécuter tous les tests"""
        print("=== DÉBUT DES TESTS API EGABANK ===\n")
        
        print("1. Test Login Admin:")
        admin_result = self.test_admin_login()
        print(json.dumps(admin_result, indent=2))
        
        print("\n2. Test Dashboard Stats:")
        dashboard_result = self.test_dashboard_stats()
        print(json.dumps(dashboard_result, indent=2))
        
        print("\n3. Test Création Client:")
        client_result = self.test_create_client()
        print(json.dumps(client_result, indent=2))
        
        print("\n=== TESTS TERMINÉS ===")

if __name__ == "__main__":
    tester = EgaBankAPITest()
    tester.run_all_tests()
```

## Notes importantes

1. **Port par défaut**: Le backend Spring Boot s'exécute sur le port 8080
2. **CORS**: Tous les contrôleurs ont `@CrossOrigin("*")` pour permettre les requêtes depuis le frontend (port 4200)
3. **Authentification**: Certains endpoints peuvent nécessiter une authentification JWT (à implémenter selon les besoins)
4. **Validation**: Les DTOs utilisent `@Valid` pour la validation des entrées
5. **Gestion d'erreurs**: Les erreurs sont retournées avec des codes HTTP appropriés (400, 401, 404, 500)

## Exécution des Tests

1. **Assurez-vous que le backend est démarré**: `mvn spring-boot:run`
2. **Utilisez Postman** pour importer la collection et exécuter les tests
3. **Exécutez les scripts** Bash ou Python pour des tests automatisés
4. **Vérifiez les logs** de l'application pour déboguer les erreurs

---

*Ce document couvre tous les endpoints API disponibles dans l'application EgaBank. Pour toute question ou mise à jour, contactez l'équipe de développement.*
