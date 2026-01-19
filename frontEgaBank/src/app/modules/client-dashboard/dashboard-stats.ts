import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { CompteService } from '../../core/services/compte.service';
import { OperationService } from '../../core/services/operation.service';
import { Compte } from '../../core/models/comptes';
import { Operation } from '../../core/models/operation';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface ClientStats {
  totalBalance: number;
  accountsCount: number;
  savingsAccounts: number;
  currentAccounts: number;
  monthlyOperations: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 font-playfair">Mon Dashboard</h1>
          <p class="text-slate-600 mt-2">Bienvenue, {{ currentUser?.fullName }}</p>
        </div>
        <button
          (click)="logout()"
          class="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
          Déconnexion
        </button>
      </div>

      <!-- Main Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Solde Total -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1"></path>
              </svg>
            </div>
            <span class="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p class="text-blue-100 text-sm font-medium mb-1">Solde Total</p>
          <h3 class="text-3xl font-bold">{{ stats.totalBalance | number:'1.0-0' }}</h3>
          <p class="text-blue-100 text-xs mt-2">CFA</p>
        </div>

        <!-- Comptes -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <p class="text-slate-600 text-sm font-medium mb-1">Comptes Bancaires</p>
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.accountsCount }}</h3>
          <p class="text-slate-500 text-xs mt-2">{{ stats.currentAccounts }} courants, {{ stats.savingsAccounts }} épargne</p>
        </div>

        <!-- Opérations Mensuelles -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <p class="text-slate-600 text-sm font-medium mb-1">Opérations (Mois)</p>
          <h3 class="text-3xl font-bold text-slate-900">{{ stats.monthlyOperations }}</h3>
          <p class="text-slate-500 text-xs mt-2">Transactions ce mois</p>
        </div>

        <!-- Bilan Mensuel -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <p class="text-slate-600 text-sm font-medium mb-1">Bilan (Mois)</p>
          <h3 class="text-2xl font-bold text-slate-900">
            <span class="text-green-600">+{{ stats.monthlyDeposits | number:'1.0-0' }}</span>
            <span class="text-red-600 ml-2">-{{ stats.monthlyWithdrawals | number:'1.0-0' }}</span>
          </h3>
          <p class="text-slate-500 text-xs mt-2">Dépôts / Retraits</p>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Accounts List -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">Mes Comptes</h2>
          <div *ngIf="comptes.length === 0" class="text-center py-8">
            <p class="text-slate-500">Aucun compte créé</p>
          </div>
          <div *ngFor="let compte of comptes" class="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
            <div>
              <p class="font-bold text-slate-900">{{ compte.numCompte }}</p>
              <p class="text-sm text-slate-600">{{ compte.type === 1 ? 'Compte Courant' : 'Compte Épargne' }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">{{ compte.balance | number:'1.0-0' }} {{ compte.devis }}</p>
              <p class="text-xs text-slate-500">{{ compte.status || 'ACTIF' }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 class="text-lg font-bold mb-6">Statistiques Rapides</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center pb-4 border-b border-white/20">
              <span class="text-indigo-100">Solde Moyen</span>
              <span class="font-bold text-lg">{{ (stats.totalBalance / (stats.accountsCount || 1)) | number:'1.0-0' }}</span>
            </div>
            <div class="flex justify-between items-center pb-4 border-b border-white/20">
              <span class="text-indigo-100">Taux d'Activité</span>
              <span class="font-bold text-lg">{{ (stats.monthlyOperations > 0 ? 'Élevé' : 'Faible') }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-indigo-100">Catégorie</span>
              <span class="font-bold text-lg">{{ (stats.totalBalance > 1000000 ? 'Premium' : 'Standard') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardStatsComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  clientId: number | null = null;
  comptes: Compte[] = [];
  operations: Operation[] = [];
  private subscriptions: Subscription[] = [];

  stats: ClientStats = {
    totalBalance: 0,
    accountsCount: 0,
    savingsAccounts: 0,
    currentAccounts: 0,
    monthlyOperations: 0,
    monthlyDeposits: 0,
    monthlyWithdrawals: 0
  };

  constructor(
    private authService: AuthService,
    private compteService: CompteService,
    private operationService: OperationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.clientId = this.authService.getClientId();

    if (!this.currentUser || !this.clientId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData() {
    if (!this.clientId) return;

    // Charger les comptes
    const compteSub = this.compteService.getClientComptes(this.clientId).subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.calculateStats(comptes);

        // Charger les opérations de tous les comptes
        if (comptes.length > 0) {
          const operationSub = this.operationService
            .getOperationsByClientCompte(this.clientId!, comptes[0].numCompte)
            .subscribe({
              next: (operations) => {
                this.operations = operations;
                this.calculateMonthlyStats(operations);
              }
            });
          this.subscriptions.push(operationSub);
        }
      }
    });

    this.subscriptions.push(compteSub);
  }

  calculateStats(comptes: Compte[]) {
    this.stats.accountsCount = comptes.length;
    this.stats.totalBalance = comptes.reduce((sum, c) => sum + c.balance, 0);
    this.stats.currentAccounts = comptes.filter(c => c.type === 1).length;
    this.stats.savingsAccounts = comptes.filter(c => c.type === 2).length;
  }

  calculateMonthlyStats(operations: Operation[]) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthOperations = operations.filter(op => new Date(op.dateOperation) >= monthStart);

    this.stats.monthlyOperations = monthOperations.length;
    this.stats.monthlyDeposits = monthOperations
      .filter(op => op.typeOperation === 'DEPOT')
      .reduce((sum, op) => sum + op.amount, 0);
    this.stats.monthlyWithdrawals = monthOperations
      .filter(op => op.typeOperation === 'RETRAIT')
      .reduce((sum, op) => sum + op.amount, 0);
  }

  logout() {
    this.authService.logout();
  }
}
