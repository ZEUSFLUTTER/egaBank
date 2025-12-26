import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../../../core/services/compte.service';
import { Operation } from '../../../../../core/models/operation';
import { Operation as OperationService } from '../../../../../core/services/operation.service';
import { Compte } from '../../../../../core/models/comptes';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './virement.html',
  styleUrl: './virement.scss',
})
export class Virement implements OnInit {
  public opForm!: FormGroup;
  public submitted = false;
  compteSource!: Compte;
  compteDest!: Compte;

  public showSourceDetails = false;
  public showDestDetails = false;

  isSuccessed = false;
  isError = '';

  constructor(
    private formBuilder: FormBuilder,
    private compteService: CompteService,
    private operationService: OperationService
  ) { }

  ngOnInit(): void {
    this.opForm = this.formBuilder.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      numCompteS: ['', [Validators.required]],
      numCompteD: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  get fb(): any {
    return this.opForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.opForm.invalid) return;

    if (this.compteSource && this.fb.montant.value > this.compteSource.balance) {
      this.isError = "Solde insuffisant pour effectuer ce virement.";
      return;
    }

    this.operationService.effectuerVirement(<Operation>{
      numCompteSource: this.fb.numCompteS.value,
      numCompteDestination: this.fb.numCompteD.value,
      amount: this.fb.montant.value
    }).subscribe({
      next: () => {
        this.isError = '';
        this.isSuccessed = true;
        this.opForm.reset();
        this.submitted = false;
        this.showSourceDetails = false;
        this.showDestDetails = false;
      },
      error: (err: any) => {
        this.isError = err.error?.message || "Erreur lors du virement";
        this.isSuccessed = false;
      }
    });
  }

  onKeyUpSource(x: any) {
    const value = x.target.value;
    const type = this.fb.type.value;
    if (value !== '' && type !== '') {
      this.compteService.getOneNumCompte(value, type).subscribe({
        next: (response: any) => {
          const data = response?.body ? response.body : response;
          if (data) {
            this.compteSource = data;
            this.showSourceDetails = true;
            this.isError = '';
          }
        },
        error: () => {
          this.showSourceDetails = false;
          this.isError = "Compte source introuvable";
        }
      });
    }
  }

  onKeyUpDest(x: any) {
    const value = x.target.value;
    const type = this.fb.type.value;
    if (value !== '' && type !== '') {
      this.compteService.getOneNumCompte(value, type).subscribe({
        next: (response: any) => {
          const data = response?.body ? response.body : response;
          if (data) {
            this.compteDest = data;
            this.showDestDetails = true;
            this.isError = '';
          }
        },
        error: () => {
          this.showDestDetails = false;
          this.isError = "Compte destination introuvable";
        }
      });
    }
  }
}
