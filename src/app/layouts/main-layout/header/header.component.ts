import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <a routerLink="/dashboard" class="logo">
          <span class="material-symbols-outlined">account_balance</span>
          <span class="logo-text">Finance Tracker</span>
        </a>
      </div>
      
      <div class="header-right">
        <button class="notification-btn">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge">3</span>
        </button>
        
        <div class="user-menu" (click)="toggleUserMenu = !toggleUserMenu">
          <div class="user-avatar" *ngIf="user">
            <img *ngIf="user.photoURL" [src]="user.photoURL" alt="User Avatar">
            <span *ngIf="!user.photoURL" class="avatar-placeholder">
              {{ user.displayName.charAt(0) }}
            </span>
          </div>
          <span class="user-name" *ngIf="user">{{ user.displayName }}</span>
          <span class="material-symbols-outlined">expand_more</span>
          
          <div class="dropdown-menu" *ngIf="toggleUserMenu">
            <a routerLink="/profile" class="dropdown-item">
              <span class="material-symbols-outlined">person</span>
              Profile
            </a>
            <a routerLink="/settings" class="dropdown-item">
              <span class="material-symbols-outlined">settings</span>
              Settings
            </a>
            <div class="dropdown-divider"></div>
            <a (click)="logout()" class="dropdown-item">
              <span class="material-symbols-outlined">logout</span>
              Logout
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 var(--spacing-lg);
      background-color: var(--background);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }
    
    .header-left, .header-right {
      display: flex;
      align-items: center;
    }
    
    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      margin-right: var(--spacing-md);
      color: var(--text-primary);
    }
    
    .logo {
      display: flex;
      align-items: center;
      color: var(--primary);
      font-weight: 500;
      font-size: 1.25rem;
      text-decoration: none;
    }
    
    .logo-text {
      margin-left: var(--spacing-sm);
    }
    
    .notification-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      margin-right: var(--spacing-lg);
      color: var(--text-primary);
    }
    
    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--danger);
      color: white;
      font-size: 0.7rem;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-md);
    }
    
    .user-menu:hover {
      background-color: var(--neutral-light);
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: var(--spacing-sm);
    }
    
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary);
      color: white;
      font-weight: 500;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--background);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: var(--border-radius-md);
      min-width: 200px;
      z-index: 10;
      margin-top: var(--spacing-sm);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-md);
      color: var(--text-primary);
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .dropdown-item:hover {
      background-color: var(--neutral-light);
    }
    
    .dropdown-item .material-symbols-outlined {
      margin-right: var(--spacing-md);
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: var(--neutral);
      margin: var(--spacing-xs) 0;
    }
    
    @media (max-width: 768px) {
      .user-name {
        display: none;
      }
      
      .logo-text {
        display: none;
      }
      
      .header {
        padding: 0 var(--spacing-md);
      }
    }
  `]
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  toggleUserMenu = false;
  
  constructor(private authService: AuthService) {}
  
  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}