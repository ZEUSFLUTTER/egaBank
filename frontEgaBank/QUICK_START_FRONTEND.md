# 🚀 Démarrage Rapide - Frontend EgaBank

## Installation en 3 minutes

### 1. Installer les dépendances

```bash
cd frontEgaBank
npm install
```

### 2. Vérifier la configuration

Le fichier `src/environments/environment.development.ts` doit pointer vers votre backend :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  prefix: 'api/v1'
};
```

### 3. Démarrer l'application

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Test rapide

### 1. Inscription d'un nouveau client

1. Ouvrir `http://localhost:4200/register`
2. Remplir le formulaire :
   - Nom: Test
   - Prénom: User
   - Date de naissance: 01/01/1990
   - Sexe: M
   - Téléphone: +221771234567
   - Email: test@example.com
   - Mot de passe: Password123!
   - Confirmer: Password123!
   - Adresse: Dakar
   - Nationalité: Sénégalaise
3. Cliquer sur "S'inscrire"

### 2. Activer le compte (via backend ou Postman)

```bash
curl -X PUT "http://localhost:8080/api/v1/clients/1/status?status=ACTIVE"
```

### 3. Se connecter

1. Aller sur `http://localhost:4200/login`
2. Sélectionner "Client"
3. Email: test@example.com
4. Mot de passe: Password123!
5. Cliquer sur "Se connecter"

### 4. Créer un compte bancaire

1. Sur le dashboard, cliquer sur "+ Nouveau compte"
2. Choisir "Compte Courant"
3. Solde initial: 100000
4. Découvert: 20000
5. Cliquer sur "Créer"

### 5. Effectuer un dépôt

1. Cliquer sur "Dépôt" dans les actions rapides
2. Sélectionner le compte
3. Montant: 50000
4. Description: Test dépôt
5. Cliquer sur "Valider"

## Structure des pages

```
/login              → Page de connexion (Client/Admin)
/register           → Page d'inscription client
/client-dashboard   → Dashboard client (protégé)
/home               → Dashboard admin (protégé)
```

## Fonctionnalités disponibles

### Dashboard Client
- ✅ Vue d'ensemble des comptes
- ✅ Solde total
- ✅ Créer un compte (Courant/Épargne)
- ✅ Effectuer un dépôt
- ✅ Effectuer un retrait
- ✅ Effectuer un virement
- ✅ Effectuer un paiement
- ✅ Voir l'historique des opérations
- ✅ Déconnexion

## Commandes utiles

```bash
# Démarrer en mode développement
npm start

# Build pour production
npm run build

# Lancer les tests
npm test

# Vérifier le code
ng lint
```

## Résolution de problèmes

### Erreur de connexion au backend

**Problème:** `ERR_CONNECTION_REFUSED`

**Solution:**
1. Vérifier que le backend est démarré sur le port 8080
2. Vérifier l'URL dans `environment.development.ts`

### Erreur CORS

**Problème:** `Access-Control-Allow-Origin`

**Solution:**
Le backend est déjà configuré pour accepter les requêtes depuis `http://localhost:4200`

### Compte non actif

**Problème:** "Votre compte n'est pas actif. Statut: PENDING"

**Solution:**
Activer le compte via l'API :
```bash
curl -X PUT "http://localhost:8080/api/v1/clients/{id}/status?status=ACTIVE"
```

## Données de test

Si vous avez chargé les données de test du backend :

**Client 1:**
- Email: amadou.diop@example.com
- Mot de passe: Password123!

**Client 2:**
- Email: fatou.ndiaye@example.com
- Mot de passe: Password123!

## Captures d'écran des fonctionnalités

### Page d'inscription
- Formulaire complet avec validation
- Tous les champs nécessaires
- Confirmation de mot de passe
- Messages d'erreur en temps réel

### Page de connexion
- Sélecteur Client/Admin
- Design moderne et sécurisé
- Lien vers l'inscription

### Dashboard Client
- Carte de solde total avec gradient
- 4 actions rapides (Dépôt, Retrait, Virement, Paiement)
- Liste des comptes avec détails
- Historique des dernières opérations
- Modals pour créer un compte et effectuer des opérations

## Technologies utilisées

- **Angular 21** - Framework
- **Tailwind CSS** - Styling
- **RxJS** - Reactive programming
- **TypeScript** - Language
- **HttpClient** - API calls

## Support

Pour toute question ou problème :
1. Vérifier que le backend est démarré
2. Vérifier la console du navigateur (F12)
3. Vérifier les logs du backend
4. Consulter la documentation complète dans `README_CLIENT.md`

Bon développement ! 🎉
