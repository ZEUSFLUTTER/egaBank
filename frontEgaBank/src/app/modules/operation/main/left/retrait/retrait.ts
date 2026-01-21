import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../../../core/services/compte.service';
import { OperationService } from '../../../../../core/services/operation.service';
import { Compte } from '../../../../../core/models/comptes';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-retrait',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './retrait.html',
  styleUrl: './retrait.scss',
})
export class Retrait implements OnInit, OnDestroy {
  public opForm!: FormGroup;
  public submitted = false;
  public isLoading = false;
  compte!: Compte;
  public showDetails: boolean = false;

  isSuccessed: boolean = false;
  isError: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private compteService: CompteService,
    private operationService: OperationService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.opForm = this.formBuilder.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      numCompte: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get fb(): any {
    return this.opForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.opForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const operationData = {
      numCompteSource: this.fb.numCompte.value,
      amount: this.fb.montant.value,
      type: 'RETRAIT'
    };

    this.operationService.effectuerRetrait({
      numCompteSource: this.fb.numCompte.value,
      amount: this.fb.montant.value
    }).subscribe({
      next: (data: any) => {
        this.isError = '';
        this.isSuccessed = true;
        this.isLoading = false;

        const montant = this.fb.montant.value;
        const numCompte = this.fb.numCompte.value;
        const ancienSolde = this.compte?.balance || 0;
        const nouveauSolde = ancienSolde - montant;

        this.opForm.reset();
        this.submitted = false;
        this.showDetails = false;
        this.cdr.detectChanges();

        // ✅ Notification de succès avec détails
        this.notificationService.notifyOperationSuccess('✓ Retrait effectué avec succès', {
          ...data,
          montantRetire: montant,
          numCompte: numCompte,
          ancienSolde: ancienSolde,
          nouveauSolde: nouveauSolde,
          compte: this.compte,
          message: `Un retrait de ${montant} FCFA a été effectué. Ancien solde: ${ancienSolde} FCFA → Nouveau solde: ${nouveauSolde} FCFA`
        });

        // Forcer le rafraîchissement des composants liés
        this.notificationService.forceRefresh('comptes');
        this.notificationService.forceRefresh('operations');

        // Réinitialiser après 3 secondes
        setTimeout(() => {
          this.isSuccessed = false;
        }, 3000);
      },
      error: (err: any) => {
        const montant = this.fb.montant.value;
        const numCompte = this.fb.numCompte.value;

        let errorMessage = err.error?.message || "Erreur lors du retrait";

        // Améliorer le message d'erreur selon le type
        if (err.status === 404) {
          errorMessage = `Erreur: Compte ${numCompte} introuvable.`;
        } else if (err.status === 400) {
          errorMessage = `Erreur: Montant invalide ou solde insuffisant (${montant} FCFA demandé).`;
        } else if (err.status === 409) {
          errorMessage = errorMessage || `Erreur: Compte ${numCompte} suspendu ou désactivé.`;
        }

        this.isError = errorMessage;
        this.isSuccessed = false;
        this.isLoading = false;
        this.cdr.detectChanges();

        this.notificationService.sendNotification({
          type: 'operation',
          action: 'error',
          message: `✗ Retrait échoué: ${errorMessage}`
        });
      }
    });
  }

  onKeyUp(x: any) {
    const value = x.target.value;
    const type = this.fb.type.value;

    if (value !== '' && type !== '') {
      this.compteService.getOneNumCompte(value, type).subscribe({
        next: (response: any) => {
          const data = response?.body ? response.body : response;
          if (data) {
            this.compte = data;
            this.showDetails = true;
            this.isError = '';
          } else {
            this.showDetails = false;
          }
        },
        error: (err: any) => {
          this.isError = err.error?.message || "Compte introuvable";
          this.showDetails = false;
          this.compte = <Compte>{};
        }
      });
    }
  }
}
