import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../core/models/client';
import { Compte } from '../../../core/models/comptes';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent {
  @Input() client: Client | null = null;
  @Input() clientAccounts: Compte[] = [];
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() editClient = new EventEmitter<Client>();
  @Output() viewAccounts = new EventEmitter<Client>();

  onClose(): void {
    this.close.emit();
  }

  onEditClient(): void {
    if (this.client) {
      this.editClient.emit(this.client);
    }
  }

  onViewAccounts(): void {
    if (this.client) {
      this.viewAccounts.emit(this.client);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
}
