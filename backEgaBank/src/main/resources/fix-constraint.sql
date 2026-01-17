-- Script pour corriger la contrainte operation_chk_1
-- Ce script supprime la contrainte problématique et la recrée correctement

-- Supprimer la contrainte existante si elle existe
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
     WHERE CONSTRAINT_SCHEMA = 'egabank' 
     AND TABLE_NAME = 'operation' 
     AND CONSTRAINT_NAME = 'operation_chk_1') > 0,
    'ALTER TABLE operation DROP CHECK operation_chk_1',
    'SELECT 1'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter une nouvelle contrainte pour s'assurer que le montant est positif
ALTER TABLE operation 
ADD CONSTRAINT operation_amount_positive 
CHECK (amount > 0);

-- Vérifier la structure de la table
DESCRIBE operation;