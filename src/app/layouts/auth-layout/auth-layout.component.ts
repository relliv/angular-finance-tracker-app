import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-content">
          <div class="logo">
            <span class="material-symbols-outlined">account_balance</span>
            <h1>Finance Tracker</h1>
          </div>
          <div class="auth-description">
            <h2>Take control of your personal finances</h2>
            <p>Track expenses, set budgets, and achieve your financial goals with our powerful finance management tools.</p>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      height: 100vh;
    }
    
    .auth-left {
      flex: 1;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
    }
    
    .auth-right {
      flex: 1;
      background-color: var(--background);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
    }
    
    .auth-content {
      max-width: 500px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }
    
    .logo .material-symbols-outlined {
      font-size: 2.5rem;
      margin-right: var(--spacing-md);
    }
    
    .logo h1 {
      font-size: 2rem;
      margin: 0;
    }
    
    .auth-description h2 {
      font-size: 2rem;
      margin-bottom: var(--spacing-md);
    }
    
    .auth-description p {
      font-size: 1.1rem;
      opacity: 0.8;
      line-height: 1.6;
    }
    
    .auth-form-container {
      width: 100%;
      max-width: 400px;
    }
    
    @media (max-width: 992px) {
      .auth-container {
        flex-direction: column;
      }
      
      .auth-left {
        padding: var(--spacing-lg);
      }
      
      .auth-right {
        padding: var(--spacing-lg);
      }
    }
    
    @media (max-width: 768px) {
      .auth-left {
        display: none;
      }
      
      .auth-right {
        flex: 1;
      }
    }
  `]
})
export class AuthLayoutComponent {}