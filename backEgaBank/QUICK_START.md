# 🚀 Démarrage Rapide - EgaBank

## Prérequis

- ✅ Java 17 installé
- ✅ MySQL 8.0 installé et démarré
- ✅ Maven installé

## Installation en 5 minutes

### 1. Créer la base de données

```sql
CREATE DATABASE egabank;
```

### 2. Configurer les identifiants MySQL

Ouvrir `src/main/resources/application.properties` et modifier si nécessaire :

```properties
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### 3. Compiler et démarrer

```bash
cd backEgaBank
mvn spring-boot:run
```

L'application démarre sur `http://localhost:8080`

## Test rapide avec cURL

### 1. Inscrire un client

```bash
curl -X POST http://localhost:8080/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "birthday": "1990-01-01",
    "sexe": "M",
    "telephone": "+221771234567",
    "email": "test@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "address": "Dakar",
    "nationalite": "Sénégalaise"
  }'
```

### 2. Activer le compte

```bash
curl -X PUT "http://localhost:8080/api/v1/clients/1/status?status=ACTIVE"
```

### 3. Se connecter

```bash
curl -X POST http://localhost:8080/api/auth/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 4. Créer un compte bancaire

```bash
curl -X POST http://localhost:8080/api/v1/clients/1/comptes \
  -H "Content-Type: application/json" \
  -d '{
    "typeCompte": 1,
    "balanceInitial": 100000,
    "devis": "FCFA",
    "decouvert": 20000
  }'
```

### 5. Effectuer un dépôt

```bash
curl -X POST http://localhost:8080/api/v1/clients/1/operations \
  -H "Content-Type: application/json" \
  -d '{
    "numCompte": "CMEG A1.2 8895 1140 0271 e",
    "amount": 50000,
    "typeOperation": "DEPOT"
  }'
```

## Test avec Postman

1. Importer `EgaBank_Postman_Collection.json`
2. Exécuter les requêtes dans l'ordre
3. Profiter ! 🎉

## Données de test

Pour charger des données de test :

```bash
mysql -u root -p egabank < src/main/resources/data-example.sql
```

**Identifiants de test :**
- Email: `amadou.diop@example.com`
- Mot de passe: `Password123!`

## Vérifier que tout fonctionne

```bash
# Vérifier la liste des clients
curl http://localhost:8080/api/v1/clients

# Vérifier les comptes d'un client
curl http://localhost:8080/api/v1/clients/1/comptes
```

## En cas de problème

### Erreur de connexion MySQL
```
Vérifier que MySQL est démarré :
- Windows: Services > MySQL
- Linux/Mac: sudo systemctl status mysql
```

### Port 8080 déjà utilisé
```
Modifier dans application.properties :
server.port=8081
```

### Erreur de compilation
```bash
mvn clean install -U
```

## Documentation complète

- 📖 [README.md](./README.md) - Documentation principale
- 🔌 [API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md) - API complète
- 📚 [GUIDE_UTILISATION.md](./GUIDE_UTILISATION.md) - Guide détaillé
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture du système

## Support

Pour toute question, consultez la documentation ou contactez l'équipe de développement.

Bon développement ! 🚀
