import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../../core/models/client';
import { ClientService } from '../../../../../core/services/client.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-client.html',
  styleUrl: './show-client.scss',
})
export class ShowClient implements OnInit, OnDestroy {

  clients: Client[] = [];
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

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

    this.subscriptions.push(clientSub, refreshSub);
  }

  onGetClients(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        console.log('Données reçues du service:', data);
        this.clients = data;
        this.isLoading = false;

        // FORCE Angular à voir le changement et à afficher le tableau immédiatement
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
        // Rafraîchir immédiatement
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
}
