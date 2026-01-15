import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Left } from "./left/left";
import { Info } from "./info/info";
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-main',
  imports: [Left, Info, CommonModule ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  public isList : boolean = false;
  public isHistoric : boolean = false;
  private sidebarListener?: (event: Event) => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.module === 'comptes') {
          if (customEvent.detail?.action === 'liste') {
            this.handleList(true);
          } else if (customEvent.detail?.action === 'historique') {
            this.handleHistorique(true);
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

  handleList ($event : boolean){
    this.isList = $event;
    this.isHistoric=false;
  }

  handleHistorique ($event : boolean){
    this.isHistoric = $event;
    this.isList= false;
  }
}
