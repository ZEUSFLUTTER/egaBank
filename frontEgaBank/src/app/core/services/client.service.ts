import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientStatus, ClientDto } from '../models/client';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/clients`;

  constructor(private httpClient: HttpClient) {}

  // Obtenir la liste des clients
  getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL);
  }

  // Créer un client
  postClients(client: ClientDto): Observable<Client> {
    return this.httpClient.post<Client>(this.API_URL, client);
  }

  // Obtenir un client par ID
  getClient(clientId: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.API_URL}/${clientId}`);
  }

  // Obtenir un client par email
  getClientByEmail(email: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.API_URL}/email/${email}`);
  }

  // Rechercher des clients
  searchClients(keyword: string): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.API_URL}/search`, {
      params: { keyword }
    });
  }

  // Obtenir les clients par statut
  getClientsByStatus(status: ClientStatus): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.API_URL}/status/${status}`);
  }

  // Mettre à jour un client
  updateClient(clientId: number, client: Partial<Client>): Observable<Client> {
    return this.httpClient.put<Client>(`${this.API_URL}/${clientId}`, client);
  }

  // Mettre à jour le statut d'un client
  updateClientStatus(clientId: number, status: ClientStatus): Observable<Client> {
    return this.httpClient.put<Client>(`${this.API_URL}/${clientId}/status`, null, {
      params: { status }
    });
  }

  // Activer un client (passer de PENDING à ACTIVE)
  activateClient(clientId: number): Observable<Client> {
    return this.httpClient.patch<Client>(`${this.API_URL}/${clientId}/activate`, null);
  }

  // Supprimer un client
  deleteClient(clientId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${clientId}`);
  }

  // Vérifier si un email existe
  existsByEmail(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}/exists/email`, {
      params: { email }
    });
  }

  // Vérifier si un téléphone existe
  existsByTelephone(telephone: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}/exists/telephone`, {
      params: { telephone }
    });
  }
}
