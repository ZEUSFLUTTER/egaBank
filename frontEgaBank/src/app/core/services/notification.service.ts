import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorInfo } from './error-handler.service';

export interface NotificationData {
  type: 'operation' | 'compte' | 'client' | 'error' | 'success';
  action: 'create' | 'update' | 'delete' | 'show';
  data?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  // Subject pour les notifications générales
  private notificationSubject = new Subject<NotificationData>();
  public notification$ = this.notificationSubject.asObservable();

  // BehaviorSubject pour forcer le rafraîchissement des listes
  private refreshSubject = new BehaviorSubject<string>('');
  public refresh$ = this.refreshSubject.asObservable();

  // Sujets spécifiques pour chaque type de données
  private operationUpdateSubject = new Subject<any>();
  public operationUpdate$ = this.operationUpdateSubject.asObservable();

  private compteUpdateSubject = new Subject<any>();
  public compteUpdate$ = this.compteUpdateSubject.asObservable();

  private clientUpdateSubject = new Subject<any>();
  public clientUpdate$ = this.clientUpdateSubject.asObservable();

  constructor() { }

  // Méthode pour envoyer une notification
  sendNotification(notification: NotificationData) {
    this.notificationSubject.next(notification);
    
    // Déclencher le rafraîchissement spécifique
    switch (notification.type) {
      case 'operation':
        this.operationUpdateSubject.next(notification.data);
        break;
      case 'compte':
        this.compteUpdateSubject.next(notification.data);
        break;
      case 'client':
        this.clientUpdateSubject.next(notification.data);
        break;
    }
  }

  // Méthode pour forcer le rafraîchissement global
  forceRefresh(component: string = 'all') {
    this.refreshSubject.next(component);
  }

  // Méthodes spécifiques pour chaque type d'opération
  notifyOperationSuccess(operationType: string, data?: any) {
    this.sendNotification({
      type: 'operation',
      action: 'create',
      data: data,
      message: `${operationType} effectué avec succès`
    });
  }

  notifyCompteUpdate(compte: any) {
    this.sendNotification({
      type: 'compte',
      action: 'update',
      data: compte,
      message: 'Compte mis à jour'
    });
  }

  notifyClientUpdate(client: any) {
    this.sendNotification({
      type: 'client',
      action: 'update',
      data: client,
      message: 'Client mis à jour'
    });
  }

  // Méthodes pour gérer les erreurs et succès
  showError(errorInfo: ErrorInfo) {
    this.sendNotification({
      type: 'error',
      action: 'show',
      data: errorInfo,
      message: errorInfo.message
    });
  }

  showSuccess(message: string, data?: any) {
    this.sendNotification({
      type: 'success',
      action: 'show',
      data: data,
      message: message
    });
  }
}