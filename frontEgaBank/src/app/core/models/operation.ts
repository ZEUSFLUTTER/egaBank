import { Compte } from './comptes';

export interface Operation {
  id: number;
  compte?: Compte;
  amount: number;
  dateOperation: Date;
  numOperation: string;
  typeOperation: TypeOperation;
}

export enum TypeOperation {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  VIREMENT = 'VIREMENT',
  PAIEMENT = 'PAIEMENT',
  FRAIS = 'FRAIS',
  INTERET = 'INTERET'
}

export interface OperationRequestDto {
  numCompte: string;
  amount: number;
  typeOperation: TypeOperation;
  description?: string;
  numCompteDestinataire?: string;
}

export interface OperationDto {
  numCompteSource: string;
  numCompteDestination?: string;
  amount: number;
}
