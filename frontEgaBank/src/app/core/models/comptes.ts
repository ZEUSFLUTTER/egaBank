import { Client } from "./client";
import { Operation } from "./operation";

export interface Compte {
  id: number;
  numCompte: string;
  balance: number;
  decouvert : number;
  tauxInteret : number;
  devis: string;
  status: any;
  createdAt: Date;
  client: Client;
  operations?: Array<Operation> ;
}
