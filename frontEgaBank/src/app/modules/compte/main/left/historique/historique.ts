import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Operation } from '../../../../../core/models/operation';
import { Operation as OperationService } from '../../../../../core/services/operation.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique implements OnInit, OnDestroy {
  public searchForm!: FormGroup;
  public ops: Operation[] = [];
  public isError: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private operationService: OperationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      numCompte: ['', [Validators.required]]
    });
    this.setupNotificationSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupNotificationSubscriptions(): void {
    // Écouter les notifications d'opérations pour rafraîchir l'historique
    const operationSub = this.notificationService.operationUpdate$.subscribe(() => {
      const numCompte = this.searchForm.value.numCompte;
      if (numCompte && numCompte.trim() !== '') {
        this.refreshOperations(numCompte);
      }
    });

    // Écouter les rafraîchissements forcés
    const refreshSub = this.notificationService.refresh$.subscribe((component) => {
      if (component === 'operations' || component === 'all') {
        const numCompte = this.searchForm.value.numCompte;
        if (numCompte && numCompte.trim() !== '') {
          this.refreshOperations(numCompte);
        }
      }
    });

    this.subscriptions.push(operationSub, refreshSub);
  }

  private refreshOperations(numCompte: string): void {
    this.operationService.getOperationsByCompte(numCompte).subscribe({
      next: (oper: Operation[]) => {
        this.ops = oper;
        this.isError = '';
      },
      error: (err: any) => {
        this.ops = [];
        this.isError = err.error?.message || "Aucune donnée trouvée pour ce compte";
      }
    });
  }

  onKeyUp(x: any) {
    const value = x.target.value;
    this.ops = [];
    this.isError = '';

    if (value && value.trim() !== '') {
      this.refreshOperations(value);
    }
  }

  formatAmount(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  downloadPDF() {
  const doc = new jsPDF();
  const numCompte = this.searchForm.value.numCompte;

  doc.setFontSize(18);
  doc.text('RELEVÉ D\'OPÉRATIONS BANCAIRES', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Numéro de compte : ${numCompte}`, 14, 30);
  doc.text(`Date d'édition : ${new Date().toLocaleString()}`, 14, 35);


  const tableData: RowInput[] = this.ops.map(op => [
    new Date(op.dateOperation).toLocaleDateString('fr-FR'),
    String(op.typeOperation),
    String(op.numOperation),
    `${op.typeOperation === 'CREDIT' ? '+' : '-'} ${this.formatAmount(op.amount)} FCFA`
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Date', 'Type Flux', 'N° Référence', 'Montant']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [245, 158, 11],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      font: 'helvetica',
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 60 },
      3: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Releve_EgaBank_${numCompte}.pdf`);
}
}
