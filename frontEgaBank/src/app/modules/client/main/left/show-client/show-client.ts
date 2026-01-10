import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../../core/models/client';
import { ClientService } from '../../../../../core/services/client.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-client.html',
  styleUrl: './show-client.scss',
})
export class ShowClient implements OnInit, OnDestroy {

  clients: Client[] = [];
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
    // Écouter les notifications de clients
    const clientSub = this.notificationService.clientUpdate$.subscribe(() => {
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
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        console.log('Données reçues du service:', data);
        this.clients = data;

        // FORCE Angular à voir le changement et à afficher le tableau immédiatement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des clients : ', err);
      },
      complete: () => {
        console.log('Récupération terminée');
      }
    });
  }
}
