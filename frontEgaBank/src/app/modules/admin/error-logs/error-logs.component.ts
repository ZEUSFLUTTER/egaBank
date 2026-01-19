import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ErrorLog {
  id: number;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  error: any;
  resolved: boolean;
}

@Component({
  selector: 'app-error-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe],
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit {
  
  errorLogs: ErrorLog[] = [];
  filteredLogs: ErrorLog[] = [];
  selectedError: ErrorLog | null = null;
  
  // Filtres
  filterStatus: string = 'all';
  filterMethod: string = 'all';
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadErrorLogs();
  }
  
  loadErrorLogs(): void {
    try {
      const storedLogs = localStorage.getItem('recentErrors');
      if (storedLogs) {
        this.errorLogs = JSON.parse(storedLogs);
        this.applyFilters();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      this.errorLogs = [];
    }
  }
  
  applyFilters(): void {
    let filtered = [...this.errorLogs];
    
    // Filtrer par statut
    if (this.filterStatus !== 'all') {
      const isResolved = this.filterStatus === 'resolved';
      filtered = filtered.filter(log => log.resolved === isResolved);
    }
    
    // Filtrer par méthode HTTP
    if (this.filterMethod !== 'all') {
      filtered = filtered.filter(log => log.method === this.filterMethod);
    }
    
    // Filtrer par terme de recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.url.toLowerCase().includes(term) ||
        log.method.toLowerCase().includes(term) ||
        log.status.toString().includes(term)
      );
    }
    
    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    this.filteredLogs = filtered;
    this.currentPage = 1;
  }
  
  get paginatedLogs(): ErrorLog[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLogs.slice(start, end);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }
  
  onFilterChange(): void {
    this.applyFilters();
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  selectError(error: ErrorLog): void {
    this.selectedError = error;
  }
  
  toggleErrorResolved(errorId: number | undefined): void {
    if (!errorId) return;
    
    const error = this.errorLogs.find(log => log.id === errorId);
    if (error) {
      error.resolved = !error.resolved;
      this.saveErrorLogs();
      this.applyFilters();
    }
  }
  
  deleteError(errorId: number): void {
    this.errorLogs = this.errorLogs.filter(log => log.id !== errorId);
    this.saveErrorLogs();
    this.applyFilters();
    
    if (this.selectedError?.id === errorId) {
      this.selectedError = null;
    }
  }
  
  clearAllErrors(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les logs d\'erreurs ?')) {
      this.errorLogs = [];
      this.filteredLogs = [];
      this.selectedError = null;
      localStorage.removeItem('recentErrors');
    }
  }
  
  exportErrors(): void {
    const dataStr = JSON.stringify(this.filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
  
  private saveErrorLogs(): void {
    try {
      localStorage.setItem('recentErrors', JSON.stringify(this.errorLogs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }
  }
  
  getErrorType(status: number): string {
    if (status >= 500) return 'Server Error';
    if (status >= 400) return 'Client Error';
    if (status >= 300) return 'Redirection';
    return 'Success';
  }
  
  getErrorClass(status: number | undefined): string {
    if (status === undefined) return 'error-unknown';
    if (status >= 500) return 'error-server';
    if (status >= 400) return 'error-client';
    if (status >= 300) return 'error-redirect';
    return 'error-success';
  }
  
  formatTimestamp(timestamp: string | undefined): string {
    if (!timestamp) return 'Inconnue';
    return new Date(timestamp).toLocaleString('fr-FR');
  }
  
  getMethodClass(method: string | undefined): string {
    if (!method) return 'method-unknown';
    return `method-${method.toLowerCase()}`;
  }
  
  getStatistics(): { total: number; resolved: number; unresolved: number; errors: number; warnings: number } {
    const total = this.errorLogs.length;
    const resolved = this.errorLogs.filter(log => log.resolved).length;
    const unresolved = total - resolved;
    const errors = this.errorLogs.filter(log => log.status >= 400).length;
    const warnings = this.errorLogs.filter(log => log.status >= 300 && log.status < 400).length;
    
    return { total, resolved, unresolved, errors, warnings };
  }
}
