-- Script SQL pour initialiser des données de test
-- Ce script est fourni à titre d'exemple uniquement

-- Insertion d'un client de test (mot de passe: Password123!)
-- Le mot de passe est hashé avec BCrypt
INSERT INTO client (id, nom, prenom, birthday, sexe, telephone, email, password, address, nationalite, status, email_verified, phone_verified, created_at, updated_at)
VALUES (1, 'Diop', 'Amadou', '1990-05-15', 'M', '+221771234567', 'amadou.diop@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Dakar, Plateau', 'Sénégalaise', 'ACTIVE', true, true, NOW(), NOW());

INSERT INTO client (id, nom, prenom, birthday, sexe, telephone, email, password, address, nationalite, status, email_verified, phone_verified, created_at, updated_at)
VALUES (2, 'Ndiaye', 'Fatou', '1995-08-20', 'F', '+221779876543', 'fatou.ndiaye@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Thiès, Centre', 'Sénégalaise', 'ACTIVE', true, true, NOW(), NOW());

-- Insertion de comptes bancaires
-- Compte Courant pour Amadou
INSERT INTO compte_bancaire (id, num_compte, balance, devis, status, created_at, client_id, type, decouvert)
VALUES (1, 'CMEG A1.2 8895 1140 0271 e', 150000, 'FCFA', 'ACTIVATED', NOW(), 1, 1, 50000);

-- Compte Épargne pour Amadou
INSERT INTO compte_bancaire (id, num_compte, balance, devis, status, created_at, client_id, type, taux_interet)
VALUES (2, 'CMEG A3.5 7722 3344 5566 e', 500000, 'FCFA', 'ACTIVATED', NOW(), 1, 2, 2.5);

-- Compte Courant pour Fatou
INSERT INTO compte_bancaire (id, num_compte, balance, devis, status, created_at, client_id, type, decouvert)
VALUES (3, 'CMEG A7.7 7611 7698 4732 7', 100000, 'FCFA', 'ACTIVATED', NOW(), 2, 1, 30000);

-- Insertion d'opérations
INSERT INTO operation (id, num_operation, amount, date_operation, type_operation, compte_id)
VALUES (1, 'OP1736934600000123', 50000, NOW(), 'DEPOT', 1);

INSERT INTO operation (id, num_operation, amount, date_operation, type_operation, compte_id)
VALUES (2, 'OP1736934700000456', 20000, NOW(), 'RETRAIT', 1);

INSERT INTO operation (id, num_operation, amount, date_operation, type_operation, compte_id)
VALUES (3, 'OP1736934800000789', 100000, NOW(), 'DEPOT', 2);
