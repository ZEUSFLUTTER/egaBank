import { Compte } from "./comptes";

export interface Operation{
  id : number;
  Compte : Compte;
  amount : number;
  dateOperation : Date;
  numOperation : String;
  numCompteSource : string;
  numCompteDestination :string;
  typeOperation : String;
}
