import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../../../core/services/compte.service';
import { OperationService } from '../../../../../core/services/operation.service';
import { Compte } from '../../../../../core/models/comptes';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-versement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './versement.html',
  styleUrl: './versement.scss',
})
export class Versement implements OnInit, OnDestroy {
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
      numCompte: [{value: '', disabled: false}, [Validators.required]],
      type: [{value: '', disabled: false}]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateFormDisabledState(): void {
    const typeControl = this.opForm.get('type');
    const numCompteControl = this.opForm.get('numCompte');

    if (this.isLoading) {
      typeControl?.disable({emitEvent: false});
      numCompteControl?.disable({emitEvent: false});
    } else {
      typeControl?.enable({emitEvent: false});
      numCompteControl?.enable({emitEvent: false});
    }
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
      type: 'VERSEMENT'
    };

    this.operationService.effectuerVersement({
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
        const nouveauSolde = ancienSolde + montant;

        this.opForm.reset();
        this.submitted = false;
        this.showDetails = false;
        this.cdr.detectChanges();

        // ✅ Notification de succès avec détails
        this.notificationService.notifyOperationSuccess('✓ Versement effectué avec succès', {
          ...data,
          montantVerse: montant,
          numCompte: numCompte,
          ancienSolde: ancienSolde,
          nouveauSolde: nouveauSolde,
          compte: this.compte,
          message: `Un versement de ${montant} FCFA a été effectué sur le compte ${numCompte}. Ancien solde: ${ancienSolde} FCFA → Nouveau solde: ${nouveauSolde} FCFA`
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

        let errorMessage = err.error?.message || "Erreur lors de l'opération";

        // Améliorer le message d'erreur selon le type
        if (err.status === 404) {
          errorMessage = `Erreur: Compte ${numCompte} introuvable.`;
        } else if (err.status === 400) {
          errorMessage = `Erreur: Montant invalide (${montant} FCFA). Veuillez vérifier.`;
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
          message: `✗ Versement échoué: ${errorMessage}`
        });
      }
    });
  }

  onKeyUp(x: any) {
    const value = x.target.value;
    const type = this.fb.type.value;

    if (value !== '') {
      this.compteService.getOneNumCompte(value, type).subscribe({
        next: (response: any) => {
          const data = response?.body ? response.body : response;

          if (data) {
            this.compte = data;
            this.showDetails = true;
            this.isError = '';
            console.log("Données reçues :", data);
          } else {
            this.showDetails = false;
          }
        },
        error: (err: any) => {
          this.isError = err.error?.message || "Compte introuvable pour ce type";
          this.showDetails = false;
          this.compte = <Compte>{};
        }
      });
    }
  }
}
