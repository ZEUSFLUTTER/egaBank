import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Compte } from '../../../../../core/models/comptes';
import { CompteService } from '../../../../../core/services/compte.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-compte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-compte.html',
  styleUrl: './list-compte.scss',
})
export class ListCompte implements OnInit, OnDestroy {
  comptes: Compte[] = [];
  type: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private compteService: CompteService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Ne pas charger les comptes au démarrage, attendre la sélection de l'utilisateur
    this.setupNotificationSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupNotificationSubscriptions(): void {
    // Écouter les notifications d'opérations pour rafraîchir les comptes
    const operationSub = this.notificationService.operationUpdate$.subscribe(() => {
      if (this.type) {
        this.onGetComptes(this.type);
      }
    });

    // Écouter les notifications de comptes
    const compteSub = this.notificationService.compteUpdate$.subscribe(() => {
      if (this.type) {
        this.onGetComptes(this.type);
      }
    });

    // Écouter les rafraîchissements forcés
    const refreshSub = this.notificationService.refresh$.subscribe((component) => {
      if (component === 'comptes' || component === 'all') {
        if (this.type) {
          this.onGetComptes(this.type);
        }
      }
    });

    this.subscriptions.push(operationSub, compteSub, refreshSub);
  }

  onSelectTypeCompte($event: any): void {
    const selectedValue = $event.target.value;
    this.type = selectedValue;

    if (!selectedValue || selectedValue === "") {
      this.comptes = [];
      return;
    }
    this.onGetComptes(selectedValue);
  }

  onGetComptes(type: string): void {
    // Ne pas faire d'appel si le type est vide
    if (!type || type === "") {
      this.comptes = [];
      this.cdr.detectChanges();
      return;
    }

    this.compteService.getCompte(type).subscribe({
      next: (data) => {
        this.comptes = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur de récupération:", err);
        this.comptes = [];
        this.cdr.detectChanges();
      }
    });
  }

  onSuspendCompte(numCompte: string): void {
    if (confirm('Voulez-vous suspendre ce compte ?')) {
      this.compteService.onSuspendreCompte(numCompte).subscribe({
        next: () => {
          this.onGetComptes(this.type);
          // Notifier les autres composants
          this.notificationService.notifyCompteUpdate({ numCompte, action: 'suspend' });
        },
        error: (err) => console.error("Erreur suspension:", err)
      });
    }
  }

  onActiveCompte(numCompte: string): void {
    this.compteService.onActivateCompte(numCompte).subscribe({
      next: () => {
        this.onGetComptes(this.type);
        // Notifier les autres composants
        this.notificationService.notifyCompteUpdate({ numCompte, action: 'activate' });
      },
      error: (err) => console.error("Erreur activation:", err)
    });
  }

  onDeleteCompte(numCompte: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.')) {
      this.compteService.deleteCompteAdmin(numCompte).subscribe({
        next: () => {
          this.onGetComptes(this.type);
          // Notifier les autres composants
          this.notificationService.notifyCompteUpdate({ numCompte, action: 'delete' });
        },
        error: (err) => console.error("Erreur suppression:", err)
      });
    }
  }
}
