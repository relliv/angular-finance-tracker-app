import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mobile-nav">
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
        <span class="material-symbols-outlined">dashboard</span>
        <span class="nav-text">Dashboard</span>
      </a>
      
      <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
        <span class="material-symbols-outlined">receipt_long</span>
        <span class="nav-text">Transactions</span>
      </a>
      
      <a routerLink="/budgets" routerLinkActive="active" class="nav-item">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="nav-text">Budgets</span>
      </a>
      
      <a routerLink="/goals" routerLinkActive="active" class="nav-item">
        <span class="material-symbols-outlined">flag</span>
        <span class="nav-text">Goals</span>
      </a>
      
      <a routerLink="/more" routerLinkActive="active" class="nav-item">
        <span class="material-symbols-outlined">more_horiz</span>
        <span class="nav-text">More</span>
      </a>
    </nav>
  `,
  styles: [`
    .mobile-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: var(--background);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 100;
      justify-content: space-around;
      align-items: center;
    }
    
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--text-secondary);
      text-decoration: none;
      padding: var(--spacing-sm);
      flex: 1;
      text-align: center;
    }
    
    .nav-item.active {
      color: var(--primary);
    }
    
    .nav-text {
      font-size: 0.75rem;
      margin-top: 4px;
    }
    
    @media (max-width: 768px) {
      .mobile-nav {
        display: flex;
      }
    }
  `]
})
export class MobileNavComponent {}