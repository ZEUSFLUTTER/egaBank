import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Ajout de ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Client } from '../../../../../core/models/client';
import { ClientService } from '../../../../../core/services/client.service';

@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-client.html',
  styleUrl: './show-client.scss',
})
export class ShowClient implements OnInit {

  clients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.onGetClients();
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
