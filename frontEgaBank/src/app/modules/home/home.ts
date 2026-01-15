import { Component, ViewChild } from '@angular/core';
import { Sidebar } from "../../shared/modules/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Sidebar, RouterOutlet, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  toggleMobileMenu() {
    if (this.sidebarRef) {
      this.sidebarRef.toggleMobileMenu();
    }
  }
}
