import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthResponse, LoginRequest } from '../../../../shared/models';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .login(this.form.value as LoginRequest)
      .pipe(
        timeout(5000),
        finalize(() => (this.isSubmitting = false))
      )
      .subscribe({
        next: (res: AuthResponse) => {
          this.router.navigate(['']);
        },
        error: (err: any) => {
          // Remove local error message since we are using snackbar now
          this.notificationService.showError('Login failed. Please check your credentials and try again.');
        }
      });
  }
}






