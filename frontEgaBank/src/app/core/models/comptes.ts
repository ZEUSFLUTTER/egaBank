import { Client } from './client';
import { Operation } from './operation';

export interface Compte {
  id: number;
  numCompte: string;
  balance: number;
  decouvert?: number;
  tauxInteret?: number;
  devis: string;
  status: AccountStatus;
  createdAt: Date;
  client?: Client;
  operations?: Array<Operation>;
}

export enum AccountStatus {
  ACTIVATED = 'ACTIVATED',
  SUSPENDED = 'SUSPENDED'
}

export interface CreateCompteDto {
  typeCompte: number; // 1 = Courant, 2 = Epargne
  balanceInitial: number;
  devis: string;
  decouvert?: number;
  tauxInteret?: number;
}

export interface CompteDto {
  clientId: number;
  balance: number;
  decouvert?: number;
  tauxInteret?: number;
}
