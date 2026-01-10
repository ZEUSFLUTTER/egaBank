import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../../../core/services/compte.service';
import { Operation } from '../../../../../core/models/operation';
import { Operation as OperationService } from '../../../../../core/services/operation.service';
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
  compte!: Compte;
  public showDetails: boolean = false;

  isSuccessed: boolean = false;
  isError: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private compteService: CompteService,
    private operationService: OperationService,
    private notificationService: NotificationService
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

    if (this.opForm.invalid) {
      return;
    }

    const operationData = {
      numCompteSource: this.fb.numCompte.value,
      amount: this.fb.montant.value,
      type: 'RETRAIT'
    };

    this.operationService.effectuerRetrait(<Operation>{
      numCompteSource: this.fb.numCompte.value,
      amount: this.fb.montant.value
    }).subscribe({
      next: (data: any) => {
        this.isError = '';
        this.isSuccessed = true;
        this.opForm.reset();
        this.submitted = false;
        this.showDetails = false;

        // 🔄 NOTIFICATION EN TEMPS RÉEL
        this.notificationService.notifyOperationSuccess('Retrait', {
          ...operationData,
          compte: this.compte
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
        this.isError = err.error?.message || "Erreur lors du retrait";
        this.isSuccessed = false;
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
