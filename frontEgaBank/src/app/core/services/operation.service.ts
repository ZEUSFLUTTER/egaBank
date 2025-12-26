import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Operation as OperationModel } from '../models/operation';

@Injectable({
  providedIn: 'root',
})
export class Operation {
  constructor(private httpClient: HttpClient) { }

  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/operations`;

  effectuerVersement(operation: OperationModel): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/versement`, operation);
  }

  effectuerRetrait(operation: OperationModel): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/retrait`, operation);
  }

  effectuerVirement(operation: OperationModel): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/virement`, operation);
  }

  getOperationsByCompte(numCompte: string): Observable<OperationModel[]> {
    return this.httpClient.get<OperationModel[]>(`${this.API_URL}/client/${numCompte}`);
  }
}
