import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequestDto, LoginResponseDto, RegisterClientDto, Client } from '../models/client';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth/client`;
  private adminApiUrl = `${environment.apiUrl}/api/v1/auth`;
  
  private currentUserSubject = new BehaviorSubject<LoginResponseDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  // Inscription client
  register(registerDto: RegisterClientDto): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/register`, registerDto);
  }

  // Connexion client
  loginClient(loginDto: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('token', response.token);
          localStorage.setItem('clientId', response.clientId.toString());
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  // Connexion admin (existant)
  loginAdmin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.adminApiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('adminUser', JSON.stringify(response));
          localStorage.setItem('isAdmin', 'true');
        }
      })
    );
  }

  // Vérifier si authentifié
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return true;
  }

  // Vérifier si admin
  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): LoginResponseDto | null {
    return this.currentUserSubject.value;
  }

  // Mettre à jour l'utilisateur actuel (ex: changement de statut)
  setCurrentUser(user: LoginResponseDto): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Conserver également les autres valeurs s'il y a lieu
      localStorage.setItem('clientId', user.clientId.toString());
      localStorage.setItem('token', user.token);
    }
    this.currentUserSubject.next(user);
  }

  // Obtenir le client ID
  getClientId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const clientId = localStorage.getItem('clientId');
      return clientId ? parseInt(clientId) : null;
    }
    return null;
  }

  // Obtenir le token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Déconnexion
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
