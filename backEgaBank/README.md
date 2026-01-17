# EgaBank - Système de Gestion Bancaire

## Description

EgaBank est une application de gestion bancaire complète permettant aux clients de :
- Créer un compte client
- Se connecter de manière sécurisée
- Créer et gérer des comptes bancaires (Courant et Épargne)
- Effectuer des opérations bancaires (Dépôts, Retraits, Virements)
- Consulter l'historique des transactions

## Technologies utilisées

- **Backend**: Spring Boot 4.0.1
- **Base de données**: MySQL
- **Sécurité**: Spring Security avec BCrypt
- **ORM**: JPA/Hibernate
- **Validation**: Jakarta Validation
- **Email**: Spring Mail
- **Build**: Maven

## Structure du projet

```
backEgaBank/
├── src/main/java/com/ega/bank/bank_management_system/
│   ├── config/          # Configurations (Sécurité, CORS)
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Entités JPA
│   ├── enums/           # Énumérations
│   ├── repositories/    # Repositories JPA
│   ├── servives/        # Services métier
│   └── web/             # Contrôleurs REST
└── src/main/resources/
    ├── application.properties
    └── data-example.sql
```

## Modèle de données

### Client
- Informations personnelles (nom, prénom, date de naissance, etc.)
- Authentification (email, mot de passe hashé)
- Statut du compte (PENDING, ACTIVE, SUSPENDED, BLOCKED, CLOSED)
- Vérification email et téléphone
- Relation OneToMany avec CompteBancaire

### CompteBancaire (Classe abstraite)
- Numéro de compte unique
- Solde
- Devise (FCFA par défaut)
- Statut (ACTIVATED, SUSPENDED)
- Relation ManyToOne avec Client
- Relation OneToMany avec Operation

#### CompteCourant (extends CompteBancaire)
- Découvert autorisé

#### CompteEpargne (extends CompteBancaire)
- Taux d'intérêt

### Operation
- Numéro d'opération unique
- Montant
- Date d'opération
- Type (DEPOT, RETRAIT, VIREMENT, PAIEMENT, FRAIS, INTERET)
- Relation ManyToOne avec CompteBancaire

## Installation et Configuration

### Prérequis
- Java 17 ou supérieur
- MySQL 8.0 ou supérieur
- Maven 3.6 ou supérieur

### Configuration de la base de données

1. Créer une base de données MySQL :
```sql
CREATE DATABASE egabank;
```

2. Configurer les paramètres dans `application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/egabank
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### Lancement de l'application

```bash
# Compiler le projet
mvn clean install

# Lancer l'application
mvn spring-boot:run
```

L'application sera accessible sur `http://localhost:8080`

## API Endpoints

Consultez le fichier [API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md) pour la documentation complète de l'API.

### Endpoints principaux

#### Authentification
- `POST /api/auth/client/register` - Inscription
- `POST /api/auth/client/login` - Connexion

#### Gestion des clients
- `GET /api/v1/clients` - Liste des clients
- `GET /api/v1/clients/{id}` - Détails d'un client
- `PUT /api/v1/clients/{id}` - Mise à jour d'un client
- `DELETE /api/v1/clients/{id}` - Suppression d'un client

#### Gestion des comptes
- `GET /api/v1/clients/{clientId}/comptes` - Comptes d'un client
- `POST /api/v1/clients/{clientId}/comptes` - Créer un compte

#### Opérations bancaires
- `POST /api/v1/clients/{clientId}/operations` - Effectuer une opération
- `GET /api/v1/clients/{clientId}/operations/compte/{numCompte}` - Historique

## Fonctionnalités de sécurité

- Mots de passe hashés avec BCrypt
- Validation des données avec Jakarta Validation
- CORS configuré pour le frontend Angular
- Sessions stateless (JWT ready)
- Emails et téléphones uniques

## Notifications

Le système envoie des notifications par email pour :
- Dépôts sur le compte
- Retraits du compte
- Virements effectués

## Tests

Pour exécuter les tests :
```bash
mvn test
```

## Données de test

Un fichier `data-example.sql` est fourni avec des données de test :
- 2 clients (mot de passe: Password123!)
- 3 comptes bancaires
- 3 opérations

## Auteurs

Équipe EgaBank

## Licence

Ce projet est sous licence privée.
