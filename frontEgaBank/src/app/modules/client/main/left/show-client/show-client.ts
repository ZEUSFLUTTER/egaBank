import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client } from '../../../../../core/models/client';
import { ClientService } from '../../../../../core/services/client.service';
import { error } from 'console';

@Component({
  selector: 'app-show-client',
  imports: [CommonModule],
  templateUrl: './show-client.html',
  styleUrl: './show-client.scss',
})
export class ShowClient {

  clients : Client[] = []

  constructor (private clientService : ClientService){}

  ngOnInit():void{
    this.onGetClients();
  }

  onGetClients():void{
    this.clientService.getClients().subscribe({
      next: (clients : Client[]) =>{
        this.clients.push(...clients);
      },
      error : (error) =>{
        console.error('Erreur lors de la recuperation des clients : ', error);
      },
      complete : () =>{
        console.log('Recuperation des clients terminé')
      }
    });
  }
}
