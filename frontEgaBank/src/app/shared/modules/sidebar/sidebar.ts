import { Component, signal, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface SubNavItem {
  title: string;
  action: string;
  icon?: string;
}

interface NavItem {
  title: string;
  path?: string;
  icon: string;
  active?: boolean;
  expanded?: boolean;
  subItems?: SubNavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: { 'ngSkipHydration': 'true' }
})
export class Sidebar implements OnInit {
  // Expose methods for parent component
  isCollapsed = signal(false);
  isMobileMenuOpen = signal(false);
  adminUser: any = null;
  expandedItems = signal<Set<string>>(new Set());

  navItems: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Comptes',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      subItems: [
        {
          title: 'Liste des comptes',
          action: 'liste'
        },
        {
          title: 'Historique',
          action: 'historique'
        }
      ]
    },
    {
      title: 'Clients',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      subItems: [
        {
          title: 'Liste des clients',
          action: 'liste'
        },
        {
          title: 'Nouveau client',
          action: 'nouveau'
        }
      ]
    },
    {
      title: 'Opérations',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      subItems: [
        {
          title: 'Versement',
          action: 'versement'
        },
        {
          title: 'Retrait',
          action: 'retrait'
        },
        {
          title: 'Virement',
          action: 'virement'
        },
        {
          title: 'Historique',
          action: 'historique'
        }
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('adminUser');
      if (userStr) {
        try {
          this.adminUser = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing admin user:', e);
        }
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleSubMenu(itemTitle: string, event?: Event) {
    // Empêcher la propagation si nécessaire
    if (event) {
      event.stopPropagation();
    }

    const expanded = this.expandedItems();
    const wasExpanded = expanded.has(itemTitle);

    // Si le menu n'était pas ouvert, l'ouvrir et naviguer
    if (!wasExpanded) {
      expanded.add(itemTitle);
      this.expandedItems.set(new Set(expanded));

      // Naviguer vers la page correspondante
      if (itemTitle === 'Comptes') {
        this.router.navigate(['/home/comptes']);
      } else if (itemTitle === 'Clients') {
        this.router.navigate(['/home/clients']);
      } else if (itemTitle === 'Opérations') {
        this.router.navigate(['/home/operations']);
      }
    } else {
      // Si le menu était ouvert, le fermer
      expanded.delete(itemTitle);
      this.expandedItems.set(new Set(expanded));
    }
  }

  isExpanded(itemTitle: string): boolean {
    return this.expandedItems().has(itemTitle);
  }

  handleSubItemClick(item: NavItem, subItem: SubNavItem, event?: Event) {
    // Empêcher la propagation
    if (event) {
      event.stopPropagation();
    }

    this.closeMobileMenu();

    // S'assurer que le menu parent est ouvert
    const expanded = this.expandedItems();
    if (!expanded.has(item.title)) {
      expanded.add(item.title);
      this.expandedItems.set(new Set(expanded));
    }

    // Navigation selon le parent et l'action
    if (item.title === 'Comptes') {
      this.router.navigate(['/home/comptes']).then(() => {
        // Émettre un événement ou utiliser un service pour communiquer avec le composant
        setTimeout(() => {
          if (subItem.action === 'liste') {
            this.triggerAction('comptes', 'liste');
          } else if (subItem.action === 'historique') {
            this.triggerAction('comptes', 'historique');
          }
        }, 200);
      });
    } else if (item.title === 'Clients') {
      this.router.navigate(['/home/clients']).then(() => {
        setTimeout(() => {
          if (subItem.action === 'liste') {
            this.triggerAction('clients', 'liste');
          } else if (subItem.action === 'nouveau') {
            this.triggerAction('clients', 'nouveau');
          }
        }, 200);
      });
    } else if (item.title === 'Opérations') {
      this.router.navigate(['/home/operations']).then(() => {
        setTimeout(() => {
          this.triggerAction('operations', subItem.action);
        }, 200);
      });
    }
  }

  private triggerAction(module: string, action: string) {
    // Utiliser un service ou un événement pour communiquer avec les composants
    const event = new CustomEvent('sidebar-action', {
      detail: { module, action }
    });
    window.dispatchEvent(event);
  }

  logout() {
    this.authService.logout();
  }
}
