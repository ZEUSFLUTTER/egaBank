import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Compte, CreateCompteDto, CompteDto } from '../models/comptes';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/comptes`;

  constructor(private httpClient: HttpClient) {}

  // Créer un compte (ancien endpoint)
  postCompte(compte: CompteDto): Observable<Compte> {
    return this.httpClient.post<Compte>(this.API_URL, compte);
  }

  // Obtenir les comptes par type
  getCompte(type: string): Observable<Compte[]> {
    return this.httpClient.get<Compte[]>(`${this.API_URL}/type/${type}`);
  }

  // Obtenir un compte par numéro
  getOneNumCompte(numCompte: string, type: string): Observable<Compte> {
    return this.httpClient.get<Compte>(`${this.API_URL}/${numCompte}/${type}`);
  }

  // Activer un compte
  onActivateCompte(numCompte: string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${this.API_URL}/active/${numCompte}`, {});
  }

  // Suspendre un compte
  onSuspendreCompte(numCompte: string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${this.API_URL}/suspendre/${numCompte}`, {});
  }

  // Supprimer un compte (endpoint admin)
  deleteCompteAdmin(numCompte: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${numCompte}`);
  }

  // ===== Nouveaux endpoints pour les clients =====

  // Obtenir tous les comptes d'un client
  getClientComptes(clientId: number): Observable<Compte[]> {
    return this.httpClient.get<Compte[]>(
      `${environment.apiUrl}/${environment.prefix}/clients/${clientId}/comptes`
    );
  }

  // Créer un compte pour un client
  createCompteForClient(clientId: number, createCompteDto: CreateCompteDto): Observable<Compte> {
    return this.httpClient.post<Compte>(
      `${environment.apiUrl}/${environment.prefix}/clients/${clientId}/comptes`,
      createCompteDto
    );
  }

  // Supprimer un compte
  deleteCompte(clientId: number, numCompte: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/${environment.prefix}/clients/${clientId}/comptes/${numCompte}`
    );
  }
}
