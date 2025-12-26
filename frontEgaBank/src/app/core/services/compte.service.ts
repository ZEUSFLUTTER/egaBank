// src/app/core/services/compte.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Compte} from '../models/comptes';

@Injectable({
  providedIn: 'root',
})
export class CompteService {

  constructor(private httpClient:HttpClient){}

  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/comptes`;

  postCompte(compte: Compte): Observable<Compte> {
    return this.httpClient.post<Compte>(this.API_URL, compte);
  }

  getCompte(type: String): Observable<Compte[]> {
    return this.httpClient.get<Compte[]>(`${this.API_URL}/type/${type}`);
  }

  getOneNumCompte(numCompte : string, type : string) : Observable<Compte>{
    return this.httpClient.get<Compte>(`${this.API_URL}/${numCompte}/${type}`)
  }

  onActivateCompte(numCompte : string) : Observable<boolean>{
    return this.httpClient.put<boolean>(`${this.API_URL}/active/${numCompte}`,{})
  }

  onSuspendreCompte(numCompte : string) : Observable<boolean>{
    return this.httpClient.put<boolean>(`${this.API_URL}/suspendre/${numCompte}`,{})
  }
}
