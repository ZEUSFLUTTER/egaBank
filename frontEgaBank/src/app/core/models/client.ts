export interface Client {
  id: number;
  nom: string;
  prenom: string;
  birthday: Date;
  sexe: string;
  telephone: string;
  email: string;
  password?: string;
  address: string;
  nationalite: string;
  status: ClientStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
}

export enum ClientStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED'
}

export interface ClientDto {
  nom: string;
  prenom: string;
  birthday: Date | string;
  sexe: string;
  telephone: string;
  email: string;
  address: string;
  nationalite: string;
}

export interface RegisterClientDto {
  nom: string;
  prenom: string;
  birthday: Date | string;
  sexe: string;
  telephone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  nationalite: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  type: string;
  clientId: number;
  email: string;
  fullName: string;
  status: string;
}
