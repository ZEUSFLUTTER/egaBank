import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  navs: any[] = [
    { title: 'Dashboard', path: '/home' },
    { title: 'Comptes', path: '/home/comptes' },
    { title: 'Clients', path: '/home/clients' },
    { title: 'Operations', path: '/home/operations' },
  ];
}
