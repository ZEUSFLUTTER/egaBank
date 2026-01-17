import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { Operation as OperationModel, OperationDto, OperationRequestDto } from '../models/operation';
import { DashboardService } from './dashboard';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/operations`;

  constructor(private httpClient: HttpClient, private dashboardService: DashboardService) {}

  // Anciens endpoints (pour compatibilité)
  effectuerVersement(operation: OperationDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/versement`, operation).pipe(
      tap(() => this.dashboardService.refresh())
    );
  }

  effectuerRetrait(operation: OperationDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/retrait`, operation).pipe(
      tap(() => this.dashboardService.refresh())
    );
  }

  effectuerVirement(operation: OperationDto): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.API_URL}/virement`, operation).pipe(
      tap(() => this.dashboardService.refresh())
    );
  }

  getOperationsByCompte(numCompte: string): Observable<OperationModel[]> {
    return this.httpClient.get<OperationModel[]>(`${this.API_URL}/client/${numCompte}`);
  }

  // ===== Nouveaux endpoints pour les clients =====

  // Effectuer une opération (dépôt, retrait, virement)
  effectuerOperation(clientId: number, operationDto: OperationRequestDto): Observable<OperationModel> {
    return this.httpClient.post<OperationModel>(
      `${environment.apiUrl}/${environment.prefix}/clients/${clientId}/operations`,
      operationDto
    ).pipe(
      tap(() => this.dashboardService.refresh())
    );
  }

  // Obtenir les opérations d'un compte
  getOperationsByClientCompte(clientId: number, numCompte: string): Observable<OperationModel[]> {
    return this.httpClient.get<OperationModel[]>(
      `${environment.apiUrl}/${environment.prefix}/clients/${clientId}/operations/compte/${numCompte}`
    );
  }
}
