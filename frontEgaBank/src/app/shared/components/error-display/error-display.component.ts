import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationData } from '../../../core/services/notification.service';
import { ErrorInfo } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss']
})
export class ErrorDisplayComponent implements OnInit, OnDestroy {
  
  @Input() error?: ErrorInfo;
  @Input() showDetails: boolean = false;
  
  currentError: ErrorInfo | null = null;
  isVisible: boolean = false;
  
  private notificationSubscription: Subscription | null = null;
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // S'abonner aux notifications d'erreur
    this.notificationSubscription = this.notificationService.notification$.subscribe(
      (notification: NotificationData) => {
        if (notification.type === 'error') {
          this.showError(notification.data as ErrorInfo);
        } else if (notification.type === 'success') {
          this.showSuccess(notification.message || 'Opération réussie');
        }
      }
    );
  }
  
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  
  showError(errorInfo: ErrorInfo): void {
    this.currentError = errorInfo;
    this.isVisible = true;
    
    // Auto-cacher après 5 secondes pour les erreurs non critiques
    if (errorInfo.type !== 'error') {
      setTimeout(() => {
        this.hideError();
      }, 5000);
    }
  }
  
  showSuccess(message: string): void {
    this.currentError = {
      message: message,
      type: 'info',
      details: '',
      action: ''
    };
    this.isVisible = true;
    
    // Auto-cacher après 3 secondes pour les succès
    setTimeout(() => {
      this.hideError();
    }, 3000);
  }
  
  hideError(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.currentError = null;
    }, 300);
  }
  
  getErrorIcon(): string {
    if (!this.currentError) return '';
    
    switch (this.currentError.type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  }
  
  getErrorClass(): string {
    if (!this.currentError) return '';
    
    const baseClass = 'error-display';
    const typeClass = `error-display--${this.currentError.type}`;
    const visibilityClass = this.isVisible ? 'error-display--visible' : 'error-display--hidden';
    
    return `${baseClass} ${typeClass} ${visibilityClass}`;
  }
  
  getErrorTitle(): string {
    if (!this.currentError) return '';
    
    switch (this.currentError.type) {
      case 'error':
        return 'Erreur';
      case 'warning':
        return 'Attention';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  }
  
  hasDetails(): boolean {
    return !!(this.currentError?.details && 
             this.currentError.details !== '' && 
             typeof this.currentError.details !== 'string');
  }
  
  isObjectDetails(): boolean {
    return this.currentError?.details !== null && 
           this.currentError?.details !== undefined &&
           typeof this.currentError?.details === 'object';
  }
  
  getDetailsKeys(): string[] {
    if (!this.isObjectDetails() || !this.currentError?.details) return [];
    const details = this.currentError.details as unknown as Record<string, any>;
    return Object.keys(details).filter(key => typeof key === 'string');
  }
  
  getDetailValue(key: string): any {
    if (!this.currentError?.details || !this.isObjectDetails()) return '';
    const details = this.currentError.details as unknown as Record<string, any>;
    return details[key];
  }
  
  formatDetailValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
  
  onRetry(): void {
    if (this.currentError?.action) {
      // Émettre un événement pour réessayer l'action
      console.log('Retry action:', this.currentError.action);
      this.hideError();
    }
  }
  
  onCopyError(): void {
    if (this.currentError) {
      const errorText = `
Erreur: ${this.currentError.message}
Type: ${this.currentError.type}
Détails: ${this.currentError.details}
Action: ${this.currentError.action}
Timestamp: ${new Date().toISOString()}
      `.trim();
      
      navigator.clipboard.writeText(errorText).then(() => {
        console.log('Erreur copiée dans le presse-papiers');
      }).catch(err => {
        console.error('Impossible de copier l\'erreur:', err);
      });
    }
  }
}
