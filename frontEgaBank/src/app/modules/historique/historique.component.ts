import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CompteService } from '../../core/services/compte.service';
import { OperationService } from '../../core/services/operation.service';
import { Compte } from '../../core/models/comptes';
import { Operation } from '../../core/models/operation';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {
  comptes: Compte[] = [];
  operations: Operation[] = [];
  selectedCompte: Compte | null = null;
  selectedCompteIndex: number = 0;
  loading = false;
  errorMessage = '';

  constructor(
    private compteService: CompteService,
    private operationService: OperationService,
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
        if (comptes.length > 0) {
          this.selectedCompte = comptes[0];
          this.selectedCompteIndex = 0;
          this.loadOperations(comptes[0].numCompte);
        }
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

  loadOperations(numCompte: string) {
    this.loading = true;
    const clientId = this.authService.getClientId();
    
    if (!clientId) {
      this.router.navigate(['/login']);
      return;
    }

    this.operationService.getOperationsByClientCompte(clientId, numCompte).subscribe({
      next: (operations: Operation[]) => {
        this.operations = operations.sort((a, b) => 
          new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des opérations';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCompteChange(index: number) {
    console.log('🔄 Historique - Changement de compte index:', index);
    console.log('🔄 Historique - Compte sélectionné:', this.comptes[index]);
    
    if (index >= 0 && this.comptes[index]) {
      this.selectedCompte = this.comptes[index];
      this.selectedCompteIndex = index;
      console.log('🔄 Historique - numCompte à charger:', this.selectedCompte.numCompte);
      this.loadOperations(this.selectedCompte.numCompte);
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/client-dashboard']);
  }

  navigateToAccounts() {
    this.router.navigate(['/mes-comptes']);
  }

  navigateToProfile() {
    this.router.navigate(['/profil']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getOperationTypeLabel(typeOperation: string): string {
    const labels: { [key: string]: string } = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'VIREMENT': 'Virement',
      'PAIEMENT': 'Paiement'
    };
    return labels[typeOperation] || typeOperation;
  }

  getOperationIcon(typeOperation: string): string {
    const icons: { [key: string]: string } = {
      'DEPOT': 'M12 4v16m8-8H4',
      'RETRAIT': 'M20 12H4',
      'VIREMENT': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m16 0l-4 4m4-4l-4-4',
      'PAIEMENT': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    };
    return icons[typeOperation] || 'M12 4v16m8-8H4';
  }

  getOperationColor(typeOperation: string): string {
    const colors: { [key: string]: string } = {
      'DEPOT': 'text-green-600 bg-green-100',
      'RETRAIT': 'text-red-600 bg-red-100',
      'VIREMENT': 'text-blue-600 bg-blue-100',
      'PAIEMENT': 'text-purple-600 bg-purple-100'
    };
    return colors[typeOperation] || 'text-gray-600 bg-gray-100';
  }
}
