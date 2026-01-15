import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Left } from "./left/left";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Info } from "./info/info";

@Component({
  selector: 'app-main',
  imports: [Left, CommonModule, Info],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  private sidebarListener?: (event: Event) => void;

  isVersement: boolean = false;
  isRetrait: boolean = false;
  isVirement: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.module === 'operations') {
          const action = customEvent.detail?.action;
          if (action === 'versement') {
            this.handleVersement(true);
          } else if (action === 'retrait') {
            this.handleRetrait(true);
          } else if (action === 'virement') {
            this.handleVirement(true);
          } else if (action === 'historique') {
            // Pour l'historique, on peut afficher une vue spéciale
            this.handleVersement(false);
            this.handleRetrait(false);
            this.handleVirement(false);
          }
        }
      };
      window.addEventListener('sidebar-action', this.sidebarListener);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.sidebarListener) {
      window.removeEventListener('sidebar-action', this.sidebarListener);
    }
  }

  handleVersement($event: boolean) {
    this.isVersement = $event;
    this.isRetrait = false;
    this.isVirement = false;
  }

  handleRetrait($event: boolean) {
    this.isVersement = false;
    this.isRetrait = $event;
    this.isVirement = false;
  }

  handleVirement($event: boolean) {
    this.isVersement = false;
    this.isRetrait = false;
    this.isVirement = $event;
  }

}
