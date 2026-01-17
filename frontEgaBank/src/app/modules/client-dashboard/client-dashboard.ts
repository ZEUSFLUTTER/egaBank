import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CompteService } from '../../core/services/compte.service';
import { OperationService } from '../../core/services/operation.service';
import { Compte, CreateCompteDto } from '../../core/models/comptes';
import { Operation, OperationRequestDto, TypeOperation } from '../../core/models/operation';
import { ClientStatus, LoginResponseDto } from '../../core/models/client';
import { Subscription, interval } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss'
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  // Exposer TypeOperation au template
  TypeOperation = TypeOperation;
  ClientStatus = ClientStatus;

  currentUser: LoginResponseDto | null = null;
  clientId: number | null = null;
  comptes: Compte[] = [];
  operations: Operation[] = [];
  selectedCompte: Compte | null = null;
  totalBalance = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Modals
  showCreateCompteModal = false;
  showOperationModalFlag = false;
  operationType: TypeOperation = TypeOperation.DEPOT;

  // Forms
  createCompteForm: FormGroup;
  operationForm: FormGroup;

  private pollingSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private compteService: CompteService,
    private operationService: OperationService,
    private dashboardService: DashboardService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.createCompteForm = this.fb.group({
      typeCompte: [{value: '1', disabled: false}, Validators.required],
      balanceInitial: [{value: 0, disabled: false}, [Validators.required, Validators.min(0)]],
      devis: [{value: 'FCFA', disabled: false}],
      decouvert: [{value: 0, disabled: false}],
      tauxInteret: [{value: 0, disabled: false}]
    });

    this.operationForm = this.fb.group({
      numCompte: [{value: '', disabled: false}, Validators.required],
      amount: [{value: 0, disabled: false}, [Validators.required, Validators.min(1)]],
      typeOperation: [{value: TypeOperation.DEPOT, disabled: false}],
      description: [{value: '', disabled: false}],
      numCompteDestinataire: [{value: '', disabled: false}]
    });
  }

  private updateFormDisabledState(): void {
    if (this.loading) {
      Object.keys(this.createCompteForm.controls).forEach(key => {
        this.createCompteForm.get(key)?.disable({emitEvent: false});
      });
      Object.keys(this.operationForm.controls).forEach(key => {
        this.operationForm.get(key)?.disable({emitEvent: false});
      });
    } else {
      Object.keys(this.createCompteForm.controls).forEach(key => {
        this.createCompteForm.get(key)?.enable({emitEvent: false});
      });
      Object.keys(this.operationForm.controls).forEach(key => {
        this.operationForm.get(key)?.enable({emitEvent: false});
      });
    }
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.clientId = this.authService.getClientId();

    if (!this.currentUser || !this.clientId) {
      this.router.navigate(['/login']);
      return;
    }

    // Premier chargement
    this.loadComptes();

    // Polling léger côté composant pour rafraîchir la liste des comptes et opérations du compte sélectionné
    this.pollingSub = interval(10000).subscribe(() => {
      this.loadComptes();
      if (this.selectedCompte) {
        this.loadOperations(this.selectedCompte.numCompte);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }

  loadComptes() {
    if (!this.clientId) return;

    this.loading = true;
    this.compteService.getClientComptes(this.clientId).subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.calculateTotalBalance();
        this.loading = false;

        if (comptes.length > 0 && !this.selectedCompte) {
          this.selectCompte(comptes[0]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des comptes';
        console.error(error);
      }
    });
  }

  calculateTotalBalance() {
    this.totalBalance = this.comptes.reduce((sum, compte) => sum + compte.balance, 0);
  }

  selectCompte(compte: Compte) {
    this.selectedCompte = compte;
    this.loadOperations(compte.numCompte);
  }

  loadOperations(numCompte: string) {
    if (!this.clientId) return;

    this.operationService.getOperationsByClientCompte(this.clientId, numCompte).subscribe({
      next: (operations) => {
        this.operations = operations.sort((a, b) =>
          new Date(b.dateOperation).getTime() - new Date(a.dateOperation).getTime()
        );
      },
      error: (error) => {
        console.error('Erreur lors du chargement des opérations', error);
      }
    });
  }

  createCompte() {
    if (this.createCompteForm.invalid || !this.clientId) return;

    this.loading = true;
    this.updateFormDisabledState();
    this.errorMessage = '';

    const formValue = this.createCompteForm.getRawValue();
    const createCompteDto: CreateCompteDto = {
      typeCompte: parseInt(formValue.typeCompte),
      balanceInitial: formValue.balanceInitial,
      devis: formValue.devis,
      decouvert: formValue.typeCompte === '1' ? formValue.decouvert : undefined,
      tauxInteret: formValue.typeCompte === '2' ? formValue.tauxInteret : undefined
    };

    this.compteService.createCompteForClient(this.clientId, createCompteDto).subscribe({
      next: (compte) => {
        this.loading = false;
        this.updateFormDisabledState();
        this.showCreateCompteModal = false;
        this.createCompteForm.reset({ typeCompte: '1', balanceInitial: 0, devis: 'FCFA' });
        this.loadComptes();
      },
      error: (error) => {
        this.loading = false;
        this.updateFormDisabledState();
        this.errorMessage = error.error?.message || error.error || 'Erreur lors de la création du compte';
      }
    });
  }

  showOperationModal(type: TypeOperation) {
    this.operationType = type;
    this.showOperationModalFlag = true;
    this.operationForm.patchValue({ typeOperation: type });
    this.errorMessage = '';
    this.successMessage = '';

    // Rendre le champ destinataire requis pour les virements
    if (type === TypeOperation.VIREMENT) {
      this.operationForm.get('numCompteDestinataire')?.setValidators([Validators.required]);
    } else {
      this.operationForm.get('numCompteDestinataire')?.clearValidators();
    }
    this.operationForm.get('numCompteDestinataire')?.updateValueAndValidity();
  }

  closeOperationModal() {
    this.showOperationModalFlag = false;
    this.operationForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  effectuerOperation() {
    if (this.operationForm.invalid || !this.clientId) return;

    this.loading = true;
    this.updateFormDisabledState();
    this.errorMessage = '';
    this.successMessage = '';

    const operationDto: OperationRequestDto = this.operationForm.getRawValue();

    this.operationService.effectuerOperation(this.clientId, operationDto).subscribe({
      next: (operation) => {
        this.updateFormDisabledState();
        this.successMessage = 'Opération effectuée avec succès !';

        setTimeout(() => {
          this.closeOperationModal();
          this.loadComptes();
          if (this.selectedCompte) {
            this.loadOperations(this.selectedCompte.numCompte);
          }
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.updateFormDisabledState()
        this.loading = false;
        this.errorMessage = error.error?.message || error.error || 'Erreur lors de l\'opération';
      }
    });
  }

  // Action d'activation (affichée seulement si user PENDING dans le template)
  activateMyAccount() {
    if (!this.clientId) return;
    this.loading = true;
    this.clientService.activateClient(this.clientId).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Compte activé.';
        // Rafraîchir l'utilisateur courant côté auth si nécessaire
        const current = this.authService.getCurrentUser();
        if (current) {
          current.status = ClientStatus.ACTIVE;
          this.authService.setCurrentUser(current);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Activation impossible';
      }
    });
  }

  viewCompteDetails(compte: Compte) {
    this.selectCompte(compte);
  }

  logout() {
    this.authService.logout();
  }
}
