import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface DialogResult {
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new Subject<DialogConfig>();
  private dialogResultSubject = new Subject<DialogResult>();

  public dialog$ = this.dialogSubject.asObservable();
  public dialogResult$ = this.dialogResultSubject.asObservable();

  showDialog(config: DialogConfig): Promise<DialogResult> {
    return new Promise((resolve) => {
      this.dialogSubject.next(config);
      
      const subscription = this.dialogResult$.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  confirmAction(title: string, message: string): Promise<boolean> {
    return this.showDialog({
      title,
      message,
      type: 'warning',
      showCancel: true,
      confirmText: 'Confirmer',
      cancelText: 'Annuler'
    }).then(result => result.confirmed);
  }

  showInfo(title: string, message: string): Promise<void> {
    return this.showDialog({
      title,
      message,
      type: 'info',
      showCancel: false,
      confirmText: 'OK'
    }).then(() => {});
  }

  showError(title: string, message: string): Promise<void> {
    return this.showDialog({
      title,
      message,
      type: 'error',
      showCancel: false,
      confirmText: 'OK'
    }).then(() => {});
  }

  showSuccess(title: string, message: string): Promise<void> {
    return this.showDialog({
      title,
      message,
      type: 'success',
      showCancel: false,
      confirmText: 'OK'
    }).then(() => {});
  }

  sendResult(result: DialogResult): void {
    this.dialogResultSubject.next(result);
  }
}
