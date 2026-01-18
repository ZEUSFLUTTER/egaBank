export interface ClientDto {
  nom: string;
  prenom: string;
  birthday: Date;
  sexe: string;
  telephone: string;
  email: string;
  address: string;
  nationalite: string;
}

export interface UpdateClientDto {
  nom?: string;
  prenom?: string;
  birthday?: Date;
  sexe?: string;
  telephone?: string;
  email?: string;
  address?: string;
  nationalite?: string;
}
