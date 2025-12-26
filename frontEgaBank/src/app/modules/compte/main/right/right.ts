import { Component, EventEmitter, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.html'
})
export class Right {

  @Output() isListed = new EventEmitter<boolean>();
  @Output() isHistorique = new EventEmitter<boolean>();


  OnclickList() {
    this.isListed.emit(true);
  }

  OnclickHistorique() {
    this.isHistorique.emit(true);
  }
}
