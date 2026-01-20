# Documentation Swagger UI - EgaBank API

## 📖 Vue d'ensemble

La documentation Swagger UI est maintenant intégrée dans votre projet EgaBank. Elle fournit une interface interactive pour explorer et tester toutes les API REST de votre application bancaire.

## 🚀 Accès à Swagger UI

### URL d'accès
- **Développement local**: http://localhost:8080/swagger-ui.html
- **Documentation OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 📋 Configuration ajoutée

### 1. Dépendance Maven
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### 2. Configuration OpenAPI
Fichier créé: `OpenApiConfig.java`
- Informations sur l'API (titre, description, version)
- Configuration des serveurs (développement et production)
- Sécurité JWT configurée
- Contact et licence

### 3. Annotations Swagger ajoutées
Tous les contrôleurs ont été enrichis avec des annotations Swagger:

#### 🏷️ Tags par contrôleur
- **Authentification Admin**: Gestion de l'authentification des administrateurs
- **Authentification Client**: Inscription et connexion des clients
- **Gestion des Clients**: CRUD complet des clients
- **Dashboard**: Statistiques du tableau de bord
- **Gestion des Comptes Bancaires**: Opérations sur les comptes
- **Gestion des Opérations**: Versements, retraits, virements
- **Comptes Clients**: Gestion des comptes par client
- **Opérations Clients**: Opérations par client

#### 📝 Annotations utilisées
- `@Tag`: Organisation des endpoints par catégorie
- `@Operation`: Description de chaque endpoint
- `@ApiResponses`: Documentation des codes de réponse
- `@Parameter`: Description des paramètres avec exemples
- `@Schema`: Définition des schémas de réponse

## 🔧 Fonctionnalités Swagger UI

### 1. Interface interactive
- **Explorez** toutes les routes disponibles
- **Testez** directement depuis l'interface
- **Visualisez** les schémas de requête/réponse
- **Téléchargez** les spécifications OpenAPI

### 2. Documentation complète
Pour chaque endpoint, vous trouverez:
- **Description détaillée** de la fonctionnalité
- **Paramètres** requis avec exemples
- **Codes de réponse** possibles (200, 201, 400, 401, 404, etc.)
- **Schémas JSON** pour les objets
- **Exemples** de requêtes et réponses

### 3. Sécurité intégrée
- Configuration JWT pour les endpoints sécurisés
- Bouton "Authorize" pour ajouter le token
- Gestion automatique de l'en-tête Authorization

## 📚 Guide d'utilisation

### 1. Démarrer l'application
```bash
cd backEgaBank
mvn spring-boot:run
```

### 2. Accéder à Swagger UI
Ouvrez votre navigateur et allez sur: http://localhost:8080/swagger-ui.html

### 3. Tester les endpoints
1. **Développez** une section (tag) pour voir les endpoints
2. **Cliquez** sur un endpoint pour voir les détails
3. **Cliquez** sur "Try it out" pour tester
4. **Remplissez** les paramètres requis
5. **Cliquez** sur "Execute" pour envoyer la requête

### 4. Authentification
Pour les endpoints sécurisés:
1. **Cliquez** sur le bouton "Authorize" en haut
2. **Entrez** votre token JWT: `Bearer votre_token_jwt`
3. **Cliquez** sur "Authorize"
4. **Fermez** la fenêtre

## 🎯 Exemples d'utilisation

### Authentification Admin
```bash
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### Créer un Client
```bash
POST /api/v1/clients
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

### Obtenir les Statistiques
```bash
GET /api/v1/dashboard/stats
```

## 📊 Endpoints disponibles

### Authentification
- `POST /api/v1/auth/login` - Connexion admin
- `POST /api/auth/client/register` - Inscription client
- `POST /api/auth/client/login` - Connexion client

### Gestion des Clients
- `GET /api/v1/clients` - Lister tous les clients
- `POST /api/v1/clients` - Créer un client
- `GET /api/v1/clients/{id}` - Obtenir un client
- `PUT /api/v1/clients/{id}` - Mettre à jour un client
- `DELETE /api/v1/clients/{id}` - Supprimer un client
- `GET /api/v1/clients/search` - Rechercher des clients
- `GET /api/v1/clients/email/{email}` - Chercher par email
- `GET /api/v1/clients/status/{status}` - Filtrer par statut
- `PATCH /api/v1/clients/{id}/activate` - Activer un client
- `GET /api/v1/clients/exists/email` - Vérifier email
- `GET /api/v1/clients/exists/telephone` - Vérifier téléphone

### Dashboard
- `GET /api/v1/dashboard/stats` - Statistiques générales

### Comptes Bancaires
- `POST /api/v1/comptes` - Créer un compte
- `GET /api/v1/comptes/type/{type}` - Lister par type
- `GET /api/v1/comptes/{numCompte}/{type}` - Obtenir un compte
- `PUT /api/v1/comptes/active/{numCompte}` - Activer un compte
- `PUT /api/v1/comptes/suspendre/{numCompte}` - Suspendre un compte

### Opérations
- `POST /api/v1/operations/versement` - Effectuer un versement
- `POST /api/v1/operations/retrait` - Effectuer un retrait
- `POST /api/v1/operations/virement` - Effectuer un virement
- `GET /api/v1/operations/client/{numCompte}` - Lister opérations

### Comptes Clients
- `GET /api/v1/clients/{clientId}/comptes` - Lister comptes client
- `POST /api/v1/clients/{clientId}/comptes` - Créer compte client
- `DELETE /api/v1/clients/{clientId}/comptes/{numCompte}` - Supprimer compte

### Opérations Clients
- `POST /api/v1/clients/{clientId}/operations` - Effectuer opération
- `GET /api/v1/clients/{clientId}/operations/compte/{numCompte}` - Lister opérations

## 🛠️ Personnalisation

### Modifier les informations de l'API
Éditez le fichier `OpenApiConfig.java` pour personnaliser:
- Titre et description
- Informations de contact
- Serveurs disponibles
- Configuration de sécurité

### Ajouter des exemples
Utilisez l'annotation `@ExampleObject` pour ajouter des exemples:
```java
@Parameter(examples = {
    @ExampleObject(name = "Exemple 1", value = "exemple@email.com")
})
```

## 🔍 Débogage

### Problèmes courants
1. **Swagger UI ne s'affiche pas**: Vérifiez que le backend est démarré
2. **Endpoints manquants**: Vérifiez les annotations `@RestController` et `@RequestMapping`
3. **Schémas incorrects**: Ajoutez des annotations `@Schema` sur les DTOs

### Logs utiles
Activez les logs pour SpringDoc:
```properties
logging.level.org.springdoc=DEBUG
```

## 📈 Avantages

1. **Documentation vivante**: Toujours à jour avec le code
2. **Tests interactifs**: Testez directement depuis le navigateur
3. **Génération de code**: Exportez les spécifications pour d'autres outils
4. **Collaboration**: Partagez facilement l'API avec les développeurs frontend
5. **Validation**: Vérifiez les requêtes avant l'implémentation

## 🚀 Prochaines étapes

1. **Tester** tous les endpoints via Swagger UI
2. **Ajouter** des exemples plus détaillés
3. **Configurer** l'environnement de production
4. **Intégrer** avec des outils de test automatisés
5. **Documenter** les erreurs spécifiques

---

*Pour toute question sur la documentation Swagger UI, contactez l'équipe de développement EgaBank.*
