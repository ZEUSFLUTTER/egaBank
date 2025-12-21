import { Compte } from "./comptes";

export interface Operation{
  compte : Compte;
  id : number;
  numOperation : String;
  dateOperation : Date;
  typeOperation : String
}
