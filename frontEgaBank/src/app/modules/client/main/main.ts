import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Left } from "./left/left";
import { Info } from "./info/info";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    Left,
    Info
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy {
  private sidebarListener?: (event: Event) => void;

  isAdd = false;
  isList = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.module === 'clients') {
          if (customEvent.detail?.action === 'liste') {
            this.showClient(true);
          } else if (customEvent.detail?.action === 'nouveau') {
            this.addClient(true);
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

  addClient($event : boolean){
    this.isAdd = $event;
    this.isList = false;
  }

  showClient($event : boolean){
    this.isAdd = false;
    this.isList = $event;
  }
}
