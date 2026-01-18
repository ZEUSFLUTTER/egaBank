import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, ClientStatus } from '../../../core/models/client';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent {
  @Input() client: Client | null = null;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Client>>();

  clientForm: FormGroup;
  clientStatuses = Object.values(ClientStatus);

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+]{8,20}$/)]], // Plus flexible pour les téléphones
      birthday: ['', [Validators.required]],
      sexe: ['M', [Validators.required]],
      status: ['PENDING', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.client) {
      this.clientForm.patchValue({
        nom: this.client.nom,
        prenom: this.client.prenom,
        email: this.client.email,
        telephone: this.client.telephone,
        birthday: this.client.birthday ? new Date(this.client.birthday).toISOString().split('T')[0] : '',
        sexe: this.client.sexe,
        status: this.client.status
      });
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      if (control && control.invalid) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Méthode publique pour le template
  getFormErrorsForTemplate(): any {
    return this.getFormErrors();
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      const clientData: Partial<Client> = {
        ...formData,
        birthday: new Date(formData.birthday)
      };
      this.save.emit(clientData);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.clientForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['email']) {
        return 'Email invalide';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['pattern']) {
        return 'Format invalide';
      }
    }
    return '';
  }
}
