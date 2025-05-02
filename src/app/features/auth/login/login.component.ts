import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-form slide-in">
      <h2 class="form-title">Sign In</h2>
      <p class="form-subtitle">Welcome back! Please sign in to continue.</p>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            class="form-control"
            [class.is-invalid]="submitted && f['email'].errors"
          >
          <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
            <div *ngIf="f['email'].errors?.['required']">Email is required</div>
            <div *ngIf="f['email'].errors?.['email']">Please enter a valid email</div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="password-label-group">
            <label for="password">Password</label>
            <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
          </div>
          <input 
            [type]="showPassword ? 'text' : 'password'" 
            id="password" 
            formControlName="password" 
            class="form-control password-input"
            [class.is-invalid]="submitted && f['password'].errors"
          >
          <button type="button" class="password-toggle" (click)="togglePasswordVisibility()">
            <span class="material-symbols-outlined">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            <div *ngIf="f['password'].errors?.['required']">Password is required</div>
          </div>
        </div>
        
        <div class="form-group remember-me">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="rememberMe">
            <span>Remember me</span>
          </label>
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">Sign In</span>
        </button>
      </form>
      
      <div class="auth-separator">
        <span>or</span>
      </div>
      
      <button type="button" class="btn btn-outline btn-block" (click)="loginWithDemo()">
        <span class="material-symbols-outlined">account_circle</span>
        Continue with Demo Account
      </button>
      
      <div class="auth-footer">
        <span>Don't have an account?</span>
        <a routerLink="/auth/register">Sign Up</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-form {
      width: 100%;
    }
    
    .form-title {
      font-size: 1.75rem;
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
    }
    
    .form-subtitle {
      margin-bottom: var(--spacing-lg);
      color: var(--text-secondary);
    }
    
    .form-group {
      margin-bottom: var(--spacing-md);
      position: relative;
    }
    
    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .password-label-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .forgot-link {
      font-size: 0.875rem;
    }
    
    .is-invalid {
      border-color: var(--danger);
    }
    
    .invalid-feedback {
      color: var(--danger);
      font-size: 0.875rem;
      margin-top: var(--spacing-xs);
    }
    
    .password-input {
      padding-right: 40px;
    }
    
    .password-toggle {
      position: absolute;
      right: 10px;
      top: 32px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
    }
    
    .remember-me {
      margin-bottom: var(--spacing-lg);
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .checkbox-label input {
      margin-right: var(--spacing-sm);
    }
    
    .btn-block {
      width: 100%;
      padding: var(--spacing-md);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--neutral);
      color: var(--text-primary);
    }
    
    .btn-outline:hover {
      background-color: var(--neutral-light);
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .btn .material-symbols-outlined {
      margin-right: var(--spacing-sm);
    }
    
    .auth-separator {
      display: flex;
      align-items: center;
      text-align: center;
      margin: var(--spacing-lg) 0;
      color: var(--text-secondary);
    }
    
    .auth-separator::before,
    .auth-separator::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--neutral);
    }
    
    .auth-separator span {
      padding: 0 var(--spacing-md);
    }
    
    .auth-footer {
      margin-top: var(--spacing-lg);
      text-align: center;
    }
    
    .auth-footer a {
      margin-left: var(--spacing-sm);
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }
  
  get f() { return this.loginForm.controls; }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  loginWithDemo(): void {
    this.loginForm.patchValue({
      email: 'demo@example.com',
      password: 'demo123'
    });
    this.onSubmit();
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    this.authService.login(
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        window.location.href = '/dashboard';
      },
      error: (error) => {
        console.error('Login error', error);
        this.loading = false;
      }
    });
  }
}