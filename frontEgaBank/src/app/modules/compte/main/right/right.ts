import { Component, EventEmitter, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.html'
})
export class Right {

  @Output() onList = new EventEmitter<boolean>();
  @Output() onHistorique = new EventEmitter<boolean>();


  OnclickList() {
    this.onList.emit(true);
  }

  OnclickHistorique() {
    this.onHistorique.emit(true);
  }
}
