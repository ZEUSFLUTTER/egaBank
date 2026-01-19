import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ClientService } from '../../core/services/client.service';
import { LoginResponseDto, Client } from '../../core/models/client';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  currentUser: LoginResponseDto | null = null;
  clientData: Client | null = null;
  profileForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      address: [''],
      birthday: [''],
      nationalite: [''],
      sexe: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadClientData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadClientData() {
    if (this.currentUser) {
      this.clientService.getClient(this.currentUser.clientId).subscribe({
        next: (client: Client) => {
          this.clientData = client;
          this.profileForm.patchValue({
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            telephone: client.telephone,
            address: client.address,
            birthday: client.birthday,
            nationalite: client.nationalite,
            sexe: client.sexe
          });
        },
        error: (error: any) => {
          this.errorMessage = 'Erreur lors du chargement des informations du profil';
        }
      });
    }
  }

  updateProfile() {
    if (this.profileForm.invalid || !this.clientData) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updatedData = {
      ...this.clientData,
      ...this.profileForm.value
    };

    this.clientService.updateClient(this.clientData.id, updatedData).subscribe({
      next: (updatedClient) => {
        this.loading = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        this.clientData = updatedClient;
        
        // Mettre à jour le nom complet dans LoginResponseDto si nécessaire
        if (this.currentUser) {
          this.currentUser.fullName = `${updatedClient.prenom} ${updatedClient.nom}`;
          this.authService.setCurrentUser(this.currentUser);
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour du profil';
      }
    });
  }

  changePassword() {
    // TODO: Implémenter la fonctionnalité de changement de mot de passe
    console.log('Changement de mot de passe à implémenter');
  }

  navigateToDashboard() {
    this.router.navigate(['/client-dashboard']);
  }

  navigateToAccounts() {
    this.router.navigate(['/mes-comptes']);
  }

  navigateToTransactions() {
    this.router.navigate(['/historique']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
