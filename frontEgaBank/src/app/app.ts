import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientService } from './core/services/client.service';
import { Client } from './core/models/client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App {
  protected readonly title = signal('frontEgaBank');
}
