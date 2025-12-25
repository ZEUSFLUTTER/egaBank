import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../../core/services/client.service';
import { Client } from '../../../../../core/models/client';
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
    private cdr: ChangeDetectorRef
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
    this.submitted = true;
    if (this.customerForm.invalid) return;

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
      next: () => {
        this.clientService.getClients().subscribe(clients => {
          const lastClient = clients[clients.length - 1];
          this.idClient = lastClient.id!;
          this.showCompteForm = true;
          this.isSuccessed = true;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
