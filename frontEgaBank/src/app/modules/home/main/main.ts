import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main.html'
})
export class Main implements OnInit {
  // Initialisation complète selon votre DashboardDto Java
  stats = {
    totalClients: 0,
    totalDeposits: 0,
    dailyVolume: 0,
    savingsAccounts: 0,
    currentAccounts: 0,
    averageBalance: 0
  };

  today: Date = new Date();
  chartData: number[] = [];
  recentOperations: any[] = []; // Contiendra la liste List<OperationDto>
  private chart: any;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getStats().subscribe({
      next: (data: any) => {
        // Mapping des données depuis le DashboardDto Java
        this.stats.totalClients = data.totalClients || 0;
        this.stats.totalDeposits = data.totalDeposits || 0;
        this.stats.dailyVolume = data.dailyVolume || 0;
        this.stats.savingsAccounts = data.savingsAccounts || 0;
        this.stats.currentAccounts = data.currentAccounts || 0;
        this.stats.averageBalance = data.averageBalance || 0;

        this.chartData = data.fluxEvolution || [];
        this.recentOperations = data.recentOperations || [];

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.initChart(), 0);
        }
      },
      error: (err) => console.error('Erreur Backend:', err)
    });
  }

  initChart() {
    const ctx = document.getElementById('evolutionChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    gradient?.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
    gradient?.addColorStop(1, 'rgba(79, 70, 229, 0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          label: 'Flux (CFA)',
          data: this.chartData.length > 0 ? this.chartData : [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#4f46e5',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#94a3b8' }
          },
          x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: 'bold' } } }
        }
      }
    });
  }

  refreshData() {
    this.loadData();
  }

  exportReport() {
    const data = [
      ['Indicateur', 'Valeur'],
      ['Total Clients', this.stats.totalClients],
      ['Total Dépôts', this.stats.totalDeposits + ' CFA'],
      ['Volume 24h', this.stats.dailyVolume],
      ['Comptes Épargne', this.stats.savingsAccounts],
      ['Comptes Courants', this.stats.currentAccounts],
      ['Solde Moyen', this.stats.averageBalance + ' CFA']
    ];

    let csvContent = "data:text/csv;charset=utf-8,"
      + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rapport_EgaBank_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
