import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../../core/services/client.service';
import { Client } from '../../../../../core/models/client';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormCompte } from "./form-compte/form-compte";

@Component({
  selector: 'app-form-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormCompte],
  templateUrl: './form-client.html',
  styleUrl: './form-client.scss',
})
export class FormClient implements OnInit {
  public customerForm!: FormGroup;
  public submitted = false;
  public isSuccessed = false;
  public idClient: number = 0;
  public name: string = '';
  public showCompteForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      address: ['', [Validators.required]],
      nationalite: ['', [Validators.required]]
    });
  }

  get fb(): any {
    return this.customerForm.controls;
  }

  onSubmit() {
    if (this.submitted || this.customerForm.invalid) return;

    this.submitted = true;

    const newClient = {
      nom: this.customerForm.value.firstName,
      prenom: this.customerForm.value.lastName,
      email: this.customerForm.value.email,
      telephone: this.customerForm.value.telephone,
      birthday: this.customerForm.value.birthday,
      sexe: this.customerForm.value.sexe,
      address: this.customerForm.value.address,
      nationalite: this.customerForm.value.nationalite,
    };

    this.clientService.postClients(newClient as Client).subscribe({
      next: (response: any) => {
        if (response && response.id) {
          this.idClient = response.id;
          this.name = response.nom + " " + response.prenom;
          this.finishRegistration();
        }

        else {
          this.clientService.getClients().subscribe(clients => {
            const lastClient = clients[clients.length - 1];
            this.idClient = lastClient.id!;
            this.name = lastClient.nom + " " + lastClient.prenom;
            this.finishRegistration();
          });
        }
      },
      error: (err) => {
        this.submitted = false;
        console.error("Erreur d'enregistrement", err);
      }
    });
  }

  // Petite fonction helper pour nettoyer la logique
  private finishRegistration() {
    this.isSuccessed = true;
    this.showCompteForm = true;
    this.cdr.detectChanges();
    
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
