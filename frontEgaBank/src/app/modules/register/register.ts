import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { RegisterClientDto } from '../../core/models/client';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: [{value: '', disabled: false}, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: [{value: '', disabled: false}, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthday: [{value: '', disabled: false}, Validators.required],
      sexe: [{value: '', disabled: false}, Validators.required],
      telephone: [{value: '', disabled: false}, [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      email: [{value: '', disabled: false}, [Validators.required, Validators.email]],
      password: [{value: '', disabled: false}, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [{value: '', disabled: false}, Validators.required],
      address: [{value: '', disabled: false}, Validators.required],
      nationalite: [{value: '', disabled: false}, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private updateFormDisabledState(): void {
    if (this.loading) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.disable({emitEvent: false});
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.enable({emitEvent: false});
      });
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.updateFormDisabledState();
      this.errorMessage = '';
      this.successMessage = '';

      const registerDto: RegisterClientDto = this.registerForm.getRawValue();

      this.authService.register(registerDto).subscribe({
        next: (response) => {
          this.loading = false;
          this.updateFormDisabledState();
          this.successMessage = 'Inscription réussie ! Votre compte est en attente d\'activation. Vous serez redirigé vers la page de connexion...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          this.updateFormDisabledState();
          this.errorMessage = error.error?.message || error.error || 'Une erreur est survenue lors de l\'inscription';
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
