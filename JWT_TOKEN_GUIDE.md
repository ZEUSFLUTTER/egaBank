# 🔐 Guide Complet du Token JWT - EgaBank

## 🎯 Objectif
Obtenir et utiliser un token JWT authentique pour les endpoints sécurisés de l'API EgaBank.

---

## 📋 Étapes pour Obtenir un Token JWT

### **1. Connexion Client (pour obtenir le token)**
**Endpoint**: `POST /api/auth/client/login`

#### Requête complète:
```bash
curl -X POST http://localhost:8080/api/auth/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "malik@gmail.com",
    "password": "votre-mot-de-passe"
  }'
```

#### Réponse attendue avec token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.example-signature",
  "type": "Bearer",
  "clientId": 103,
  "email": "malik@gmail.com",
  "fullName": "malik DOGBLA",
  "status": "ACTIVE",
  "expiresIn": 3600
}
```

---

### **2. Connexion Administrateur (alternative)**
**Endpoint**: `POST /api/v1/auth/login`

#### Requête:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### Réponse admin (sans token JWT):
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@egabank.com",
  "role": "ADMIN"
}
```

---

## 🔑 Structure du Token JWT

### **Token réel obtenu après connexion client:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8
```

### **Décodage du token (Header + Payload):**
```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "malik@gmail.com",
  "clientId": 103,
  "email": "malik@gmail.com",
  "fullName": "malik DOGBLA",
  "status": "ACTIVE",
  "iat": 17689026010,
  "exp": 1768999010
}
```

---

## 🚀 Utilisation du Token JWT

### **1. Format d'en-tête Authorization**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8
```

### **2. Exemples d'utilisation avec curl**

#### **Requête authentifiée:**
```bash
curl -X GET http://localhost:8080/api/v1/clients/103 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8" \
  -H "Content-Type: application/json"
```

#### **Opération avec authentification:**
```bash
curl -X POST http://localhost:8080/api/v1/operations/versement \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8" \
  -H "Content-Type: application/json" \
  -d '{
    "numCompte": "CC123456",
    "amount": 1000.00,
    "description": "Versement avec token"
  }'
```

---

## 📱 Utilisation en JavaScript/Angular

### **1. Stockage du token:**
```javascript
// Après connexion réussie
localStorage.setItem('jwtToken', response.token);
localStorage.setItem('userInfo', JSON.stringify(response));
```

### **2. Création du header Authorization:**
```javascript
const getToken = () => {
  return localStorage.getItem('jwtToken');
};

const createAuthHeaders = () => {
  const token = getToken();
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};
```

### **3. Requête HTTP avec token:**
```javascript
// Avec fetch
fetch('/api/v1/clients/103', {
  method: 'GET',
  headers: createAuthHeaders()
})
.then(response => response.json())
.then(data => console.log(data));

// Avec HttpClient Angular
getClients(): Observable<any[]> {
  return this.http.get<any[]>('/api/v1/clients', {
    headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
  });
}
```

---

## 🧪 Tests Postman

### **1. Configuration de l'authentification:**
1. Ouvrir Postman
2. Aller dans **Authorization** tab
3. Type: **Bearer Token**
4. Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **2. Collection avec authentification:**
```json
{
  "info": {
    "name": "EgaBank API Authenticated",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Client Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/v1/clients/{{clientId}}",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "clients", "{{clientId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "jwt_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8"
    },
    {
      "key": "clientId",
      "value": "103"
    }
  ]
}
```

---

## ⏰ Gestion du Token

### **1. Vérification d'expiration:**
```javascript
const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
```

### **2. Rafraîchissement automatique:**
```javascript
const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/client/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getOldToken()}`
      }
    });
    const data = await response.json();
    localStorage.setItem('jwtToken', data.token);
    return data.token;
  } catch (error) {
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  }
};
```

---

## 🔍 Débogage

### **1. Vérifier le token actuel:**
```bash
# Décoder le token JWT
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8" | cut -d'.' -f2 | base64 -d
```

### **2. Tester le token:**
```bash
# Test avec le token
curl -X GET http://localhost:8080/api/v1/dashboard/stats \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -v
```

---

## 📋 Résumé des Étapes

### **Pour obtenir un token JWT valide:**

1. **Créer un compte client** (si nécessaire)
2. **Se connecter** avec `/api/auth/client/login`
3. **Récupérer le token** dans la réponse
4. **Utiliser le token** dans l'en-tête `Authorization: Bearer <token>`

### **Format final du token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJpYXQiOjE3Njg5MDI2MDEwLCJleHAiOjE3Njg5ODkwMTB9.7lLjK9hM8T3Y4kXm7pQ2sRfD6Vn1L9wXyZ7jK8
```

---

## 🚨 Points Importants

- ✅ **Le token expire** après 1 heure (3600 secondes)
- ✅ **Toujours vérifier** l'expiration avant utilisation
- ✅ **Stocker sécurisé** le token (localStorage ou sessionStorage)
- ✅ **Rafraîchir** le token avant expiration
- ✅ **Utiliser HTTPS** en production

---

*Pour toute question sur l'authentification JWT, consultez la documentation API : http://localhost:8080/api-docs.html*
