import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompteService } from './../../../../../../core/services/compte.service';

@Component({
  selector: 'app-form-compte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-compte.html',
})



export class FormCompte implements OnInit, OnChanges {
  @Input() clientId: number = 0;
  @Input() clientName: string = '';

  public isSuccessed: boolean = false;
  public submitted: boolean = false;
  public compteForm!: FormGroup;
  public isCourant: boolean = true;
  public isEpargne: boolean = false;

  constructor(private fb: FormBuilder, private compteService: CompteService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.compteForm) {

      if (changes['clientId'] && changes['clientId'].currentValue) {
        this.compteForm.patchValue({ clientId: changes['clientId'].currentValue });
      }

      if (changes['clientName'] && changes['clientName'].currentValue) {
        this.compteForm.patchValue({ name: changes['clientName'].currentValue });
      }
    }
  }

  private initForm() {
    this.compteForm = this.fb.group({
      clientId: [this.clientId],
      name: [this.clientName],
      dt: ['', [Validators.required, Validators.min(0)]],
      balance: ['', [Validators.required, Validators.min(0)]],
      type: ['', [Validators.required]]
    });

    this.compteForm.get('type')?.valueChanges.subscribe(val => {
      this.isCourant = val === 'COURANT';
      this.isEpargne = val === 'EPARGNE';
      this.compteForm.get('dt')?.reset();
    });
  }

  onsubmit() {
    this.submitted = true;
    if (this.compteForm.invalid) return;

    const payload = {
      decouvert: this.isCourant ? Number(this.compteForm.value.dt) : 0,
      tauxInteret: this.isEpargne ? Number(this.compteForm.value.dt) : 0,
      balance: Number(this.compteForm.value.balance),
      clientId: Number(this.clientId),
      type: this.compteForm.value.type
    };

    this.compteService.postCompte(payload as any).subscribe({
      next: (data) => {
        this.isSuccessed = true;
        this.compteForm.disable();
        console.log("Compte créé !", data);
      },
      error: (err) => {
        console.error('Erreur:', err);
      }
    });
  }

  resetAll() {
    this.isSuccessed = false;
    this.submitted = false;
    this.compteForm.enable();
    this.compteForm.reset({
      clientId: this.clientId,
      name: this.clientName,
      type: ''
    });
  }
}
