import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Operation {

  constructor(private httpClient:HttpClient){}

  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/operations`;

  effectuerVersement(operation : Operation) : Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.API_URL}/versement`,operation)
  }

  effectuerRetrait(operation : Operation) : Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.API_URL}/retrait`,operation)
  }

  effectuerVirement(operation : Operation) : Observable<boolean>{
    return this.httpClient.post<boolean>(`${this.API_URL}/virement`,operation)
  }
}
