import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Compte } from '../../../../../core/models/comptes';
import { CompteService } from '../../../../../core/services/compte.service';

@Component({
  selector: 'app-list-compte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-compte.html',
  styleUrl: './list-compte.scss',
})
export class ListCompte implements OnInit {
  comptes: Compte[] = [];
  type: string = 'CC';

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.onGetComptes(this.type);
  }

  onSelectTypeCompte($event: any): void {
    this.type = $event.target.value;
    if (this.type) {
      this.onGetComptes(this.type);
    } else {
      this.comptes = [];
    }
  }

  onGetComptes(type: string): void {
    this.compteService.getCompte(type).subscribe({
      next: (data) => {
        this.comptes = data;
      },
      error: (err) => console.error(err)
    });
  }

  onSuspendCompte(numCompte: string): void {
    if (confirm('Voulez-vous vraiment suspendre ce compte ?')) {
      this.compteService.onSuspendreCompte(numCompte).subscribe({
        next: () => {
          this.onGetComptes(this.type);
        },
        error: (err) => console.error(err)
      });
    }
  }

  onActiveCompte(numCompte: string): void {
    this.compteService.onActivateCompte(numCompte).subscribe({
      next: () => {
        this.onGetComptes(this.type);
      },
      error: (err) => console.error(err)
    });
  }
}
