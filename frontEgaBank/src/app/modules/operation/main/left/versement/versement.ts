import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../../../core/services/compte.service';
import { Operation } from '../../../../../core/models/operation';
import { Operation as OperationService } from '../../../../../core/services/operation.service';
import { Compte } from '../../../../../core/models/comptes';
import { error } from 'console';

@Component({
  selector: 'app-versement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './versement.html',
  styleUrl: './versement.scss',
})
export class Versement  implements OnInit {
  public opForm!: FormGroup;
  public submitted = false;
  compte!: Compte;
  public showDetails: boolean = false;

  isSuccessed: boolean = false;
  isError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private compteService: CompteService,
    private operationService: OperationService
  ) { }

  ngOnInit(): void {
    this.opForm = this.formBuilder.group({
      montant: ['', [Validators.required, Validators.min(1)]],
      numCompte: ['', [Validators.required]],
      type: ['']
    });
  }

  get fb(): any {
    return this.opForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.opForm.invalid) {
      return;
    }

    this.operationService.effectuerVersement(<Operation>{
      numCompteSource: this.fb.numCompte.value,
      amount: this.fb.montant.value
    }).subscribe({
      next: (data: any) => {
        this.isError = '';
        this.isSuccessed = true;
        this.opForm.reset();
        this.submitted = false;
      },
      error: (err: any) => {
        this.isError = err.error?.message || "Erreur lors de l'opération";
        this.isSuccessed = false;
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
