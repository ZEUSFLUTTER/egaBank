import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompteService } from './../../../../../../core/services/compte.service';
import { NotificationService } from './../../../../../../core/services/notification.service';

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

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private notificationService: NotificationService
  ) { }

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
      clientId: [{value: this.clientId, disabled: false}],
      name: [{value: this.clientName, disabled: false}],
      dt: [{value: '', disabled: false}, [Validators.required, Validators.min(0)]],
      balance: [{value: '', disabled: false}, [Validators.required, Validators.min(0)]],
      type: [{value: '', disabled: false}, [Validators.required]]
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
      decouvert: this.isCourant ? Number(this.compteForm.getRawValue().dt) : 0,
      tauxInteret: this.isEpargne ? Number(this.compteForm.getRawValue().dt) : 0,
      balance: Number(this.compteForm.getRawValue().balance),
      clientId: Number(this.clientId),
      type: this.compteForm.getRawValue().type
    };

    this.compteService.postCompte(payload as any).subscribe({
      next: (data) => {
        this.isSuccessed = true;
        this.compteForm.disable();
        console.log("Compte créé !", data);

        // 🔄 NOTIFICATION EN TEMPS RÉEL - Nouveau compte créé
        this.notificationService.notifyCompteUpdate({
          ...payload,
          numCompte: data?.numCompte || 'nouveau',
          action: 'create'
        });

        // Forcer le rafraîchissement de la liste des comptes
        this.notificationService.forceRefresh('comptes');
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
