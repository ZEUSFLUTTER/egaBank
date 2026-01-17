import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, interval, switchMap, tap } from 'rxjs';
import { DashboardStats } from '../models/dashboard';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnDestroy {
  private readonly API_URL = `${environment.apiUrl}/${environment.prefix}/dashboard`;

  // Etat en mémoire du dashboard et mécanisme de refresh
  private stats$ = new BehaviorSubject<DashboardStats | null>(null);
  private refreshTrigger$ = new Subject<void>();
  private pollingSub?: Subscription;

  constructor(private http: HttpClient) {
    // Premier chargement
    this.refresh();
    // Démarrer un polling léger (toutes les 15s)
    this.startPolling(15000);
  }

  // Observable pour le composant
  statsChanges(): Observable<DashboardStats | null> {
    return this.stats$.asObservable();
  }

  // Appel direct à l'API (utilisable ponctuellement)
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/stats`);
  }

  // Force un rechargement depuis l'API et notifie les abonnés
  refresh(): void {
    this.http.get<DashboardStats>(`${this.API_URL}/stats`).subscribe({
      next: (data) => this.stats$.next(data),
      error: () => {
        // En cas d'erreur réseau, on ne casse pas le flux
      }
    });
  }

  // Démarre/relance un polling périodique
  startPolling(ms: number = 15000): void {
    this.stopPolling();
    this.pollingSub = interval(ms)
      .pipe(
        tap(() => this.refresh())
      )
      .subscribe();
  }

  stopPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
