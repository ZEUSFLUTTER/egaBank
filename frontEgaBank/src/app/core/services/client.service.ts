import { Client } from './../models/client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/clients`;

  constructor(private httpClient: HttpClient) {}


  // avoir la liste de mes clients
  getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.API_URL,{});
  }

  // creer un client
  postClients(client : Client): Observable<Client> {
    return this.httpClient.post<Client>(this.API_URL,client);
  }

    // avoir un client
  getClient(clientId: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.API_URL}/${clientId}`);
  }
}
