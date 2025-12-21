import { Client } from "./client";
import { Operation } from "./operation";

export interface Compte {
  id: number;
  numCompte: string;
  balance: number;
  devis: string;
  status: any;
  createdAt: Date;
  client: Client;
  operations?: Array<Operation> ;
}
