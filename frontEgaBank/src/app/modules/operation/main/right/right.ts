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

  @Output() isVersement = new EventEmitter<boolean>();
  @Output() isRetrait = new EventEmitter<boolean>();
  @Output() isVirement = new EventEmitter<boolean>();

  onClickVersement() {
    this.isVersement.emit(true);
  }

  onClickRetrait() {
    this.isRetrait.emit(true);
  }
    onClickVirement() {
    this.isVirement.emit(true);
  }


}
