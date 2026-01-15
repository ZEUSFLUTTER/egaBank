import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.html',
  styleUrl: './right.scss',
})
export class Right {

  @Output() onVersement = new EventEmitter<boolean>();
  @Output() onRetrait = new EventEmitter<boolean>();
  @Output() onVirement = new EventEmitter<boolean>();

  onClickVersement() {
    this.onVersement.emit(true);
  }

  onClickRetrait() {
    this.onRetrait.emit(true);
  }

  onClickVirement() {
    this.onVirement.emit(true);
  }

}
