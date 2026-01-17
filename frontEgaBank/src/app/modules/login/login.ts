import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  error = false;
  errorMessage = '';
  isLoading = false;
  loginType: 'client' | 'admin' = 'client';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.error = false;
    this.errorMessage = '';

    if (this.loginType === 'client') {
      // Connexion client
      this.auth.loginClient({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/client-dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = true;
          this.errorMessage = err.error?.message || err.error || 'Email ou mot de passe incorrect';
          console.error('Erreur login client:', err);
        }
      });
    } else {
      // Connexion admin (existant)
      this.auth.loginAdmin(this.email, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = true;
          this.errorMessage = 'Identifiants administrateur incorrects';
          console.error('Erreur login admin:', err);
        }
      });
    }
  }

  switchLoginType(type: 'client' | 'admin') {
    this.loginType = type;
    this.error = false;
    this.errorMessage = '';
  }
}
