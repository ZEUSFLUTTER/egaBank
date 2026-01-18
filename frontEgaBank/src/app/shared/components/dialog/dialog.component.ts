import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfig, DialogResult } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() config: DialogConfig | null = null;
  @Output() close = new EventEmitter<DialogResult>();

  onConfirm(): void {
    this.close.emit({ confirmed: true });
  }

  onCancel(): void {
    this.close.emit({ confirmed: false });
  }
}
