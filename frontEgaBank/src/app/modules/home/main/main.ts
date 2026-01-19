import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, DoCheck, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard';
import { DashboardStats, OperationDto } from '../../../core/models/dashboard';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main.html'
})
export class Main implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  stats: DashboardStats = {
    totalClients: 0,
    totalDeposits: 0,
    dailyVolume: 0,
    savingsAccounts: 0,
    currentAccounts: 0,
    averageBalance: 0,
    fluxEvolution: [],
    depositsEvolution: [],
    withdrawalsEvolution: [],
    recentOperations: []
  };

  today: Date = new Date();
  isLoading = false;
  private chart: any;
  private pieRetryCount = 0;
  private maxRetries = 5;
  private pieChart: any;

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
        if (this.stats.fluxEvolution && this.stats.fluxEvolution.length > 0) {
          this.initChart();
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
    this.destroyPieChart();
  }

  ngDoCheck(): void {
    console.log('🔄 ngDoCheck détecté');
    // Forcer la mise à jour du template après chargement des données
    if (this.isLoading === false) {
      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          console.log('📊 Template mis à jour via ngDoCheck');
          
          // Initialiser les graphiques si les données sont disponibles
          if (this.stats.fluxEvolution && this.stats.fluxEvolution.length > 0) {
            setTimeout(() => {
              this.initChart();
            }, 100);
          } else if (this.stats.totalClients > 0 || this.stats.totalDeposits > 0) {
            // Utiliser des données par défaut si fluxEvolution est vide
            setTimeout(() => {
              this.stats.fluxEvolution = [10000, 15000, 12000, 18000, 20000, 16000, 22000];
              this.stats.depositsEvolution = [50000, 75000, 60000, 90000, 85000, 100000, 95000];
              this.stats.withdrawalsEvolution = [30000, 45000, 35000, 50000, 40000, 60000, 55000];
              this.initChart();
            }, 100);
          }
        });
      }
    }
  }

  // Méthodes pour le cercle dynamique
  getCircleDashArray(currentAccounts: number, savingsAccounts: number): string {
    const total = currentAccounts + savingsAccounts;
    if (total === 0) return '0 628'; // Cercle vide
    
    const percentage = (currentAccounts / total) * 100;
    const circumference = 2 * Math.PI * 100; // 2πr avec r=100
    const dashLength = (percentage / 100) * circumference;
    
    return `${dashLength} ${circumference}`;
  }

  getPercentage(value: number, otherValue: number): number {
    const total = value + otherValue;
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  loadData() {
    this.isLoading = true;
    console.log('🔄 Chargement des données du dashboard...');
    
    // Timeout de sécurité pour éviter que isLoading reste true indéfiniment
    const safetyTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('⚠️ Timeout de sécurité: réinitialisation de isLoading');
        this.isLoading = false;
      }
    }, 10000); // 10 secondes
    
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        clearTimeout(safetyTimeout); // Annuler le timeout si tout se passe bien
        
        console.log('✅ Données reçues:', data);
        
        // S'assurer que toutes les propriétés existent et sont des nombres
        const processedData = {
          totalClients: Number(data.totalClients) || 0,
          totalDeposits: Number(data.totalDeposits) || 0,
          dailyVolume: Number(data.dailyVolume) || 0,
          savingsAccounts: Number(data.savingsAccounts) || 0,
          currentAccounts: Number(data.currentAccounts) || 0,
          averageBalance: Number(data.averageBalance) || 0,
          fluxEvolution: Array.isArray(data.fluxEvolution) ? data.fluxEvolution : [],
          depositsEvolution: Array.isArray(data.depositsEvolution) ? data.depositsEvolution : Array.isArray(data.fluxEvolution) ? data.fluxEvolution : [],
          withdrawalsEvolution: Array.isArray(data.withdrawalsEvolution) ? data.withdrawalsEvolution : [],
          recentOperations: Array.isArray(data.recentOperations) ? data.recentOperations : []
        };

        // Mapper les données depuis le DashboardDto Java
        this.stats = processedData;

        console.log('📊 Stats mappées:', this.stats);
        console.log('📊 totalClients:', this.stats.totalClients);
        console.log('📊 totalDeposits:', this.stats.totalDeposits);
        console.log('📊 currentAccounts:', this.stats.currentAccounts);
        console.log('📊 savingsAccounts:', this.stats.savingsAccounts);
        this.isLoading = false;

        // Forcer la mise à jour du template avec requestAnimationFrame
        if (isPlatformBrowser(this.platformId)) {
          requestAnimationFrame(() => {
            console.log('📊 Données chargées avec succès');
          });
        }

        if (isPlatformBrowser(this.platformId)) {
          // Pas d'initialisation de graphiques pour le moment
        }
      },
      error: (err) => {
        clearTimeout(safetyTimeout); // Annuler le timeout en cas d'erreur
        console.error('❌ Erreur lors du chargement:', err);
        this.isLoading = false;
      }
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

    // Créer les gradients
    const gradientDeposits = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    gradientDeposits?.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
    gradientDeposits?.addColorStop(1, 'rgba(34, 197, 94, 0)');

    const gradientWithdrawals = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    gradientWithdrawals?.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    gradientWithdrawals?.addColorStop(1, 'rgba(239, 68, 68, 0)');

    try {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [
            {
              label: 'Dépôts (CFA)',
              data: this.stats.depositsEvolution && this.stats.depositsEvolution.length > 0
                ? this.stats.depositsEvolution
                : [50000, 75000, 60000, 90000, 85000, 100000, 95000],
              borderColor: '#22c55e',
              backgroundColor: gradientDeposits,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#22c55e',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 3
            },
            {
              label: 'Retraits (CFA)',
              data: this.stats.withdrawalsEvolution && this.stats.withdrawalsEvolution.length > 0
                ? this.stats.withdrawalsEvolution
                : [30000, 45000, 35000, 50000, 40000, 60000, 55000],
              borderColor: '#ef4444',
              backgroundColor: gradientWithdrawals,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#ef4444',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: { 
            legend: { 
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            } 
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { 
                color: '#f1f5f9'
              },
              border: {
                display: false
              },
              ticks: { 
                color: '#94a3b8',
                font: {
                  size: 11
                },
                callback: function(value) {
                  return value.toLocaleString() + ' CFA';
                }
              }
            },
            x: { 
              grid: { display: false }, 
              ticks: { 
                color: '#64748b', 
                font: { 
                  weight: 'bold',
                  size: 12
                } 
              } 
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du graphique:', error);
    }
  }

  destroyPieChart(): void {
    if (this.pieChart) {
      try {
        this.pieChart.destroy();
      } catch (error) {
        console.warn('Erreur lors de la destruction du graphique circulaire:', error);
      }
      this.pieChart = null;
    }
  }

  initPieChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const ctx = document.getElementById('accountsPieChart') as HTMLCanvasElement;
    if (!ctx) {
      if (this.pieRetryCount < this.maxRetries) {
        this.pieRetryCount++;
        console.warn(`Canvas accountsPieChart non trouvé, essai ${this.pieRetryCount}/${this.maxRetries} dans 200ms...`);
        setTimeout(() => this.initPieChart(), 200);
      } else {
        console.error('❌ Canvas accountsPieChart non trouvé après ${this.maxRetries} essais. Abandon.');
        console.error('Vérifiez que l\'élément <canvas id="accountsPieChart"> existe dans le template HTML.');
      }
      return;
    }

    // Réinitialiser le compteur de retry si succès
    this.pieRetryCount = 0;

    // Détruire le graphique existant s'il y en a un
    this.destroyPieChart();

    // Vérifier si Chart.js a déjà un graphique enregistré pour ce canvas
    const existingChart = (Chart as any).getChart(ctx);
    if (existingChart) {
      try {
        existingChart.destroy();
      } catch (error) {
        console.warn('Erreur lors de la destruction du graphique circulaire existant:', error);
      }
    }

    try {
      this.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Comptes Courants', 'Comptes Épargne'],
          datasets: [{
            data: [this.stats.currentAccounts || 0, this.stats.savingsAccounts || 0],
            backgroundColor: [
              '#3b82f6',
              '#10b981'
            ],
            borderColor: [
              '#ffffff',
              '#ffffff'
            ],
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 13,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '65%',
          animation: {
            animateRotate: true,
            animateScale: false
          }
        }
      });
      console.log('✅ Graphique circulaire initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du graphique circulaire:', error);
    }
  }

  refreshData() {
    this.isLoading = true;
    
    // Simple refresh de 2 secondes sans graphiques
    setTimeout(() => {
      this.loadData();
    }, 2000);
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
