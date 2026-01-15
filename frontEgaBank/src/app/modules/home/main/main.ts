import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main.html'
})
export class Main implements OnInit, OnDestroy, AfterViewInit {
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

  ngAfterViewInit(): void {
    // S'assurer que le DOM est prêt avant d'initialiser le graphique
    if (isPlatformBrowser(this.platformId)) {
      // Attendre un peu pour que le template soit complètement rendu
      setTimeout(() => {
        if (this.chartData.length > 0) {
          this.initChart();
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
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
          // Détruire l'ancien graphique avant d'en créer un nouveau
          this.destroyChart();
          // Attendre que le DOM soit prêt
          setTimeout(() => this.initChart(), 100);
        }
      },
      error: (err) => console.error('Erreur Backend:', err)
    });
  }

  destroyChart(): void {
    if (this.chart) {
      try {
        this.chart.destroy();
      } catch (error) {
        console.warn('Erreur lors de la destruction du graphique:', error);
      }
      this.chart = null;
    }
  }

  initChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = document.getElementById('evolutionChart') as HTMLCanvasElement;
    if (!ctx) {
      console.warn('Canvas evolutionChart non trouvé');
      return;
    }

    // Détruire le graphique existant s'il y en a un
    this.destroyChart();

    // Vérifier si Chart.js a déjà un graphique enregistré pour ce canvas
    const existingChart = (Chart as any).getChart(ctx);
    if (existingChart) {
      try {
        existingChart.destroy();
      } catch (error) {
        console.warn('Erreur lors de la destruction du graphique existant:', error);
      }
    }

    const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    gradient?.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
    gradient?.addColorStop(1, 'rgba(79, 70, 229, 0)');

    try {
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
    } catch (error) {
      console.error('Erreur lors de la création du graphique:', error);
    }
  }

  refreshData() {
    this.destroyChart();
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
