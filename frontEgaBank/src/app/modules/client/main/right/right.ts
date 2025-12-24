import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [],
  templateUrl: './right.html',
  styleUrl: './right.scss',
})
export class Right {

  @Output() onAdded = new EventEmitter<boolean>();
  @Output() onListed = new EventEmitter<boolean>();

  onClickAdd() {
    this.onAdded.emit(true);
  }

  onClickListClient() {
    this.onListed.emit(true);
  }
}
