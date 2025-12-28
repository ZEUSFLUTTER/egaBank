import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  error = false;
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.error = false;

    this.auth.login(this.username, this.password).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = true;
        console.error('Erreur de connexion', err);
      }
    });
  }
}
