import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Client, ClientStatus } from '../../../../../core/models/client';
import { UpdateClientDto } from '../../../../../core/models/client-dto';
import { ClientService } from '../../../../../core/services/client.service';
import { CompteService } from '../../../../../core/services/compte.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Compte, CreateCompteDto } from '../../../../../core/models/comptes';

// Import components
import { DialogComponent } from '../../../../../shared/components/dialog/dialog.component';
import { ClientDetailComponent } from '../../../../../shared/components/client-detail/client-detail.component';
import { ClientEditComponent } from '../../../../../shared/components/client-edit/client-edit.component';
import { ClientAccountsComponent } from '../../../../../shared/components/client-accounts/client-accounts.component';

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    ClientDetailComponent,
    ClientEditComponent,
    ClientAccountsComponent
  ],
  templateUrl: './show-client.html',
  styleUrl: './show-client.scss',
})
export class ShowClient implements OnInit, OnDestroy {

  clients: Client[] = [];
  isLoading = false;
  private subscriptions: Subscription[] = [];

  // Modal states
  showClientDetail = false;
  showClientEdit = false;
  showClientAccounts = false;
  showStatusDialog = false;
  showCreateAccountModal = false;

  // Current data
  selectedClient: Client | null = null;
  selectedClientAccounts: Compte[] = [];
  dialogConfig: any = null;

  // Create account form
  createCompteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private compteService: CompteService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {
    this.createCompteForm = this.fb.group({
      typeCompte: ['1', Validators.required],
      balanceInitial: [0, [Validators.required, Validators.min(0)]],
      devis: [{value: 'XOF', disabled: true}],
      decouvert: [0],
      tauxInteret: [0]
    });
  }

  ngOnInit(): void {
    this.onGetClients();
    this.setupNotificationSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupNotificationSubscriptions(): void {
    // Écouter les notifications de clients avec debounce pour éviter les appels multiples
    const clientSub = this.notificationService.clientUpdate$
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.onGetClients();
      });

    // Écouter les rafraîchissements forcés
    const refreshSub = this.notificationService.refresh$.subscribe((component) => {
      if (component === 'clients' || component === 'all') {
        this.onGetClients();
      }
    });

    // Écouter les dialogues du DialogService
    const dialogSub = this.dialogService.dialog$.subscribe(config => {
      this.dialogConfig = config;
      this.cdr.detectChanges();
    });

    // Écouter les résultats des dialogues
    const dialogResultSub = this.dialogService.dialogResult$.subscribe(result => {
      this.dialogService.sendResult(result);
    });

    this.subscriptions.push(clientSub, refreshSub, dialogSub, dialogResultSub);
  }

  onGetClients(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        console.log('Données reçues du service:', data);
        this.clients = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients : ', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Récupération terminée');
      }
    });
  }

  approve(client: Client): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clientService.activateClient(client.id).subscribe({
      next: () => {
        this.notificationService.notifyOperationSuccess('Client validé avec succès');
        setTimeout(() => this.onGetClients(), 300);
      },
      error: (err: any) => {
        console.error('Erreur lors de la validation du client:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'client',
          action: 'update',
          message: 'Erreur lors de la validation du client'
        });
      }
    });
  }

  async viewClient(client: Client): Promise<void> {
    this.selectedClient = client;
    this.showClientDetail = true;

    // Charger les comptes du client
    this.loadClientAccounts(client.id);
  }

  async updateClient(client: Client): Promise<void> {
    this.selectedClient = client;
    this.showClientEdit = true;
  }

  async changeStatus(client: Client): Promise<void> {
    const statuses = Object.values(ClientStatus).filter(status => status !== client.status);
    const statusOptions = statuses.map(status => ({ label: status, value: status }));

    let selectedStatus: ClientStatus | null = null;

    // Créer un dialogue de sélection de statut
    const confirmed = await this.dialogService.confirmAction(
      'Changer le statut',
      `Voulez-vous changer le statut de ${client.nom} ${client.prenom} ?\nStatut actuel: ${client.status}`
    );

    if (confirmed) {
      // Pour l'instant, on alterne entre ACTIVE et SUSPENDED
      const newStatus = client.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      this.updateClientStatus(client, newStatus as ClientStatus);
    }
  }

  async viewAccounts(client: Client): Promise<void> {
    this.selectedClient = client;
    this.showClientAccounts = true;
    this.loadClientAccounts(client.id);
  }

  async deleteClient(client: Client): Promise<void> {
    // D'abord, vérifier si le client a des comptes
    this.compteService.getClientComptes(client.id).subscribe({
      next: (accounts) => {
        if (accounts.length > 0) {
          // Le client a des comptes, demander confirmation pour tout supprimer
          const message = `Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?\n\n⚠️ Ce client a ${accounts.length} compte(s) bancaire(s) qui seront aussi supprimés :\n${accounts.map(acc => `• ${acc.numCompte} (${acc.devis})`).join('\n')}\n\nCette action est irréversible.`;

          this.dialogService.confirmAction(
            'Supprimer le client et ses comptes',
            message
          ).then(confirmed => {
            if (confirmed) {
              this.performDeleteClientWithAccounts(client);
            }
          }).catch(err => {
            console.error('Erreur dans le dialogService.confirmAction:', err);
          });
        } else {
          // Le client n'a pas de comptes, suppression simple
          const simpleMessage = `Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?\n\nCette action est irréversible.`;

          this.dialogService.confirmAction(
            'Supprimer le client',
            simpleMessage
          ).then(confirmed => {
            if (confirmed) {
              this.performDeleteClient(client);
            }
          }).catch(err => {
            console.error('Erreur dans le dialogService.confirmAction simple:', err);
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification des comptes:', err);
        // En cas d'erreur, proposer la suppression simple
        this.dialogService.confirmAction(
          'Supprimer le client',
          `Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?\n\nCette action est irréversible.`
        ).then(confirmed => {
          if (confirmed) {
            this.performDeleteClient(client);
          }
        });
      }
    });
  }

  private loadClientAccounts(clientId: number): void {
    this.compteService.getClientComptes(clientId).subscribe({
      next: (accounts: Compte[]) => {
        this.selectedClientAccounts = accounts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        this.selectedClientAccounts = [];
        this.cdr.detectChanges();
      }
    });
  }

  private updateClientStatus(client: Client, newStatus: ClientStatus): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clientService.updateClientStatus(client.id, newStatus).subscribe({
      next: (updatedClient) => {
        this.notificationService.notifyOperationSuccess(`Statut du client mis à jour: ${newStatus}`);
        setTimeout(() => this.onGetClients(), 300);
      },
      error: (err: any) => {
        console.error('Erreur lors du changement de statut:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'client',
          action: 'update',
          message: 'Erreur lors du changement de statut'
        });
      }
    });
  }

  private performDeleteClient(client: Client): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clientService.deleteClient(client.id).subscribe({
      next: () => {
        this.notificationService.notifyOperationSuccess('Client supprimé avec succès');
        setTimeout(() => this.onGetClients(), 300);
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression du client:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'client',
          action: 'delete',
          message: 'Erreur lors de la suppression du client'
        });
      }
    });
  }

  private performDeleteClientWithAccounts(client: Client): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    // Supprimer d'abord les comptes du client
    this.compteService.getClientComptes(client.id).subscribe({
      next: (accounts) => {
        const deleteObservables = accounts.map(account =>
          this.compteService.deleteCompte(client.id, account.numCompte)
        );

        // Supprimer tous les comptes en parallèle
        forkJoin(deleteObservables).subscribe({
          next: () => {
            // Une fois tous les comptes supprimés, supprimer le client
            this.clientService.deleteClient(client.id).subscribe({
              next: () => {
                this.notificationService.notifyOperationSuccess(`Client et ses ${accounts.length} compte(s) supprimés avec succès`);
                setTimeout(() => this.onGetClients(), 300);
              },
              error: (err: any) => {
                console.error('Erreur lors de la suppression du client:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
                this.notificationService.sendNotification({
                  type: 'client',
                  action: 'delete',
                  message: 'Erreur lors de la suppression du client'
                });
              }
            });
          },
          error: (err: any) => {
            console.error('Erreur lors de la suppression des comptes:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
            this.notificationService.sendNotification({
              type: 'client',
              action: 'delete',
              message: 'Erreur lors de la suppression des comptes'
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des comptes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'client',
          action: 'delete',
          message: 'Erreur lors de la récupération des comptes'
        });
      }
    });
  }

  // Modal handlers
  closeClientDetail(): void {
    this.showClientDetail = false;
    this.selectedClient = null;
    this.selectedClientAccounts = [];
  }

  closeClientEdit(): void {
    this.showClientEdit = false;
    this.selectedClient = null;
  }

  closeClientAccounts(): void {
    this.showClientAccounts = false;
    this.selectedClient = null;
    this.selectedClientAccounts = [];
  }

  onEditClientFromDetail(client: Client): void {
    this.closeClientDetail();
    this.updateClient(client);
  }

  onViewAccountsFromDetail(client: Client): void {
    this.closeClientDetail();
    this.viewAccounts(client);
  }

  async onSaveClient(clientData: Partial<Client>): Promise<void> {
    if (!this.selectedClient) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    // Convertir Partial<Client> en UpdateClientDto
    const updateData: UpdateClientDto = {
      nom: clientData.nom,
      prenom: clientData.prenom,
      email: clientData.email,
      telephone: clientData.telephone,
      birthday: clientData.birthday,
      sexe: clientData.sexe
    };

    this.clientService.updateClient(this.selectedClient.id, updateData).subscribe({
      next: (updatedClient) => {
        this.notificationService.notifyOperationSuccess('Client mis à jour avec succès');
        this.closeClientEdit();
        setTimeout(() => this.onGetClients(), 300);
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour du client:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'client',
          action: 'update',
          message: 'Erreur lors de la mise à jour du client'
        });
      }
    });
  }

  onCreateAccountFromAccounts(client: Client): void {
    this.selectedClient = client;
    this.showCreateAccountModal = true;
    this.createCompteForm.reset({
      typeCompte: '1',
      balanceInitial: 0,
      devis: 'XOF',
      decouvert: 0,
      tauxInteret: 0
    });
    this.cdr.detectChanges();
  }

  createCompte(): void {
    if (this.createCompteForm.invalid || !this.selectedClient) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    const formValue = this.createCompteForm.getRawValue();
    const createCompteDto: CreateCompteDto = {
      typeCompte: parseInt(formValue.typeCompte),
      balanceInitial: formValue.balanceInitial,
      devis: formValue.devis,
      decouvert: formValue.typeCompte === '1' ? formValue.decouvert : undefined,
      tauxInteret: formValue.typeCompte === '2' ? formValue.tauxInteret : undefined
    };

    // Store clientId before it becomes null
    const clientId = this.selectedClient.id;
    const clientName = `${this.selectedClient.nom} ${this.selectedClient.prenom}`;

    this.compteService.createCompteForClient(clientId, createCompteDto).subscribe({
      next: (compte) => {
        this.notificationService.notifyOperationSuccess(`Compte ${compte.numCompte} créé avec succès pour ${clientName}`);
        this.closeCreateAccountModal();
        this.loadClientAccounts(clientId);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur lors de la création du compte:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.sendNotification({
          type: 'compte',
          action: 'create',
          message: err.error?.message || 'Erreur lors de la création du compte'
        });
      }
    });
  }

  closeCreateAccountModal(): void {
    this.showCreateAccountModal = false;
    this.selectedClient = null;
    this.createCompteForm.reset({
      typeCompte: '1',
      balanceInitial: 0,
      devis: 'XOF',
      decouvert: 0,
      tauxInteret: 0
    });
  }

  onAccountDeleted(): void {
    // Rafraîchir la liste des comptes du client actuel
    if (this.selectedClient) {
      this.loadClientAccounts(this.selectedClient.id);
    }
  }

  onDialogClose(result: any): void {
    this.dialogService.sendResult(result);
    this.dialogConfig = null;
  }
}
