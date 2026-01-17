import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ClientService } from '../../../../../core/services/client.service';
import { RegisterClientDto } from '../../../../../core/models/client';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AuthService } from '../../../../../core/services/auth';
import { FormCompte } from './form-compte/form-compte';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormCompte],
  templateUrl: './form-client.html',
  styleUrl: './form-client.scss',
})
export class FormClient implements OnInit, OnDestroy {
  public customerForm!: FormGroup;
  public submitted = false;
  public isSuccessed = false;
  public isLoading = false;
  public idClient: number = 0;
  public name: string = '';
  public showCompteForm: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      nom: [{value: '', disabled: false}, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: [{value: '', disabled: false}, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [{value: '', disabled: false}, [Validators.required, Validators.email]],
      telephone: [{value: '', disabled: false}, [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      birthday: [{value: '', disabled: false}, Validators.required],
      sexe: [{value: 'M', disabled: false}, Validators.required],
      address: [{value: '', disabled: false}, Validators.required],
      nationalite: [{value: '', disabled: false}, Validators.required],
      password: [{value: '', disabled: false}, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{value: '', disabled: false}, Validators.required],
      profession: [{value: '', disabled: false}],
      pieceIdentite: [{value: '', disabled: false}],
      numeroPiece: [{value: '', disabled: false}]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateFormDisabledState(): void {
    if (this.isLoading) {
      Object.keys(this.customerForm.controls).forEach(key => {
        this.customerForm.get(key)?.disable({emitEvent: false});
      });
    } else {
      Object.keys(this.customerForm.controls).forEach(key => {
        this.customerForm.get(key)?.enable({emitEvent: false});
      });
    }
  }

  get fb(): any {
    return this.customerForm.controls;
  }

  onSubmit() {
    if (this.submitted || this.isLoading || this.customerForm.invalid) return;

    // Check for password match
    if (this.customerForm.hasError('passwordMismatch')) {
      this.notificationService.sendNotification({
        type: 'client',
        action: 'create',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    this.submitted = true;
    this.isLoading = true;
    this.updateFormDisabledState();
    this.cdr.detectChanges();

    const formValue = this.customerForm.getRawValue();

    // Create RegisterClientDto for the backend (using the same endpoint as client self-registration)
    const registerDto: RegisterClientDto = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      email: formValue.email,
      telephone: formValue.telephone,
      birthday: formValue.birthday,
      sexe: formValue.sexe,
      address: formValue.address,
      nationalite: formValue.nationalite,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      profession: formValue.profession || undefined,
      pieceIdentite: formValue.pieceIdentite || undefined,
      numeroPiece: formValue.numeroPiece || undefined
    };

    console.log('Sending RegisterClientDto:', registerDto);

    // Use the same registration endpoint as public registration
    this.authService.register(registerDto).subscribe({
      next: (response: any) => {
        this.submitted = false;
        this.isLoading = false;
        this.updateFormDisabledState();
        this.cdr.detectChanges();

        if (response && response.id) {
          this.idClient = response.id;
          this.name = response.nom + " " + response.prenom;
          this.finishRegistration();
        } else {
          this.finishRegistration();
        }
      },
      error: (err) => {
        this.submitted = false;
        this.isLoading = false;
        this.updateFormDisabledState();
        this.cdr.detectChanges();
        console.error("Erreur d'enregistrement", err);

        // Log the full error response to help debug
        if (err.error && typeof err.error === 'object') {
          console.error("Détails de l'erreur:", JSON.stringify(err.error));
        } else if (err.error && typeof err.error === 'string') {
          console.error("Détails de l'erreur:", err.error);
        }

        this.notificationService.sendNotification({
          type: 'client',
          action: 'create',
          message: err.error?.message || err.error || 'Erreur lors de la création du client'
        });
      }
    });
  }

  private finishRegistration() {
    this.isSuccessed = true;
    this.showCompteForm = true;
    this.isLoading = false;
    this.updateFormDisabledState();
    this.cdr.detectChanges();

    // ✅ Notification de succès
    this.notificationService.notifyOperationSuccess('Client créé avec succès');

    // 🔄 NOTIFICATION EN TEMPS RÉEL - Nouveau client créé
    this.notificationService.notifyClientUpdate({
      id: this.idClient,
      nom: this.name,
      action: 'create'
    });

    // Forcer le rafraîchissement de la liste des clients
    this.notificationService.forceRefresh('clients');
  }
}
