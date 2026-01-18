import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../core/models/client';
import { Compte } from '../../../core/models/comptes';
import { CompteService } from '../../../core/services/compte.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-client-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-accounts.component.html',
  styleUrls: ['./client-accounts.component.scss']
})
export class ClientAccountsComponent {
  @Input() client: Client | null = null;
  @Input() clientAccounts: Compte[] = [];
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() createAccount = new EventEmitter<Client>();
  @Output() accountDeleted = new EventEmitter<void>();

  constructor(
    private compteService: CompteService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  onClose(): void {
    this.close.emit();
  }

  onCreateAccount(): void {
    if (this.client) {
      this.createAccount.emit(this.client);
    }
  }

  async onDeleteAccount(account: Compte): Promise<void> {
    console.log('Bouton supprimer compte cliqué pour:', account);
    
    const confirmed = await this.dialogService.confirmAction(
      'Supprimer le compte',
      `Êtes-vous sûr de vouloir supprimer le compte ${account.numCompte} ?\n\nSolde actuel: ${this.formatBalance(account.balance, account.devis)}\n\nCette action est irréversible.`
    );
    
    console.log('Résultat de la confirmation de suppression de compte:', confirmed);
    
    if (confirmed) {
      this.performDeleteAccount(account);
    } else {
      console.log('Suppression de compte annulée par l\'utilisateur');
    }
  }

  private performDeleteAccount(account: Compte): void {
    if (!this.client) return;

    this.compteService.deleteCompte(this.client.id, account.numCompte).subscribe({
      next: () => {
        this.notificationService.notifyOperationSuccess(`Compte ${account.numCompte} supprimé avec succès`);
        this.accountDeleted.emit(); // Notifier le parent pour rafraîchir la liste
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression du compte:', err);
        this.notificationService.sendNotification({
          type: 'compte',
          action: 'delete',
          message: 'Erreur lors de la suppression du compte'
        });
      }
    });
  }

  async onChangeAccountStatus(account: Compte): Promise<void> {
    const newStatus = account.status === 'ACTIVATED' ? 'SUSPENDED' : 'ACTIVATED';
    
    const confirmed = await this.dialogService.confirmAction(
      'Changer le statut du compte',
      `Voulez-vous changer le statut du compte ${account.numCompte} de ${account.status} à ${newStatus} ?`
    );
    
    if (confirmed) {
      this.compteService.onActivateCompte(account.numCompte).subscribe({
        next: () => {
          this.notificationService.notifyOperationSuccess(`Statut du compte ${account.numCompte} mis à jour: ${newStatus}`);
          this.accountDeleted.emit(); // Notifier le parent pour rafraîchir la liste
        },
        error: (err: any) => {
          console.error('Erreur lors du changement de statut:', err);
          this.notificationService.sendNotification({
            type: 'compte',
            action: 'update',
            message: 'Erreur lors du changement de statut du compte'
          });
        }
      });
    }
  }

  getAccountStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVATED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  formatBalance(balance: number, devise: string): string {
    // Utiliser XOF pour FCFA (Franc CFA)
    const currencyCode = devise === 'FCFA' || devise === 'XOF' ? 'XOF' : devise;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode
    }).format(balance);
  }

  getActiveAccountsCount(): number {
    return this.clientAccounts.filter(a => a.status === 'ACTIVATED').length;
  }

  getTotalBalance(): number {
    return this.clientAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  }

  trackByAccountNum(index: number, account: Compte): string {
    return account.numCompte;
  }
}
