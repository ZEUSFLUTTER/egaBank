import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CompteService } from '../../core/services/compte.service';
import { Compte } from '../../core/models/comptes';

@Component({
  selector: 'app-mes-comptes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-comptes.component.html',
  styleUrl: './mes-comptes.component.scss'
})
export class MesComptesComponent implements OnInit {
  comptes: Compte[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private compteService: CompteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadComptes();
  }

  loadComptes() {
    this.loading = true;
    const clientId = this.authService.getClientId();
    
    if (!clientId) {
      this.router.navigate(['/login']);
      return;
    }

    this.compteService.getClientComptes(clientId).subscribe({
      next: (comptes: Compte[]) => {
        this.comptes = comptes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectCompte(compte: Compte) {
    // Navigation vers le dashboard avec ce compte sélectionné
    this.router.navigate(['/client-dashboard'], { 
      queryParams: { 
        compte: compte.numCompte 
      } 
    });
  }

  navigateToDashboard() {
    this.router.navigate(['/client-dashboard']);
  }

  navigateToTransactions() {
    this.router.navigate(['/historique']);
  }

  navigateToProfile() {
    this.router.navigate(['/profil']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatAccountNumber(numCompte: string): string {
    if (!numCompte) return 'N/A';
    return numCompte;
  }

  getAccountType(compte: Compte): string {
    // Logique améliorée pour déterminer le type de compte
    if (compte.tauxInteret !== undefined && compte.tauxInteret > 0) {
      return 'Compte Épargne';
    } else if (compte.decouvert !== undefined && compte.decouvert > 0) {
      return 'Compte Courant';
    } else {
      // Fallback
      return 'Compte Courant';
    }
  }

  getAccountTypeNumber(compte: Compte): number {
    // Retourne le type numérique pour les classes CSS
    if (compte.tauxInteret !== undefined && compte.tauxInteret > 0) {
      return 2; // Épargne
    } else {
      return 1; // Courant
    }
  }
}
