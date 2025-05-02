import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="!expanded">
      <div class="sidebar-header">
        <div class="brand" *ngIf="expanded">
          <span class="material-symbols-outlined">account_balance</span>
          <span class="brand-text">Finance Tracker</span>
        </div>
        <button class="toggle-btn" (click)="toggleExpanded.emit()">
          <span class="material-symbols-outlined">{{ expanded ? 'chevron_left' : 'chevron_right' }}</span>
        </button>
      </div>
      
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="nav-text" *ngIf="expanded">Dashboard</span>
          </a>
          
          <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">receipt_long</span>
            <span class="nav-text" *ngIf="expanded">Transactions</span>
          </a>
          
          <a routerLink="/budgets" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <span class="nav-text" *ngIf="expanded">Budgets</span>
          </a>
          
          <a routerLink="/reports" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">bar_chart</span>
            <span class="nav-text" *ngIf="expanded">Reports</span>
          </a>
          
          <a routerLink="/goals" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">flag</span>
            <span class="nav-text" *ngIf="expanded">Goals</span>
          </a>
          
          <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">calendar_month</span>
            <span class="nav-text" *ngIf="expanded">Calendar</span>
          </a>
        </nav>
        
        <div class="sidebar-divider"></div>
        
        <nav class="sidebar-nav">
          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">settings</span>
            <span class="nav-text" *ngIf="expanded">Settings</span>
          </a>
          
          <a routerLink="/help" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">help</span>
            <span class="nav-text" *ngIf="expanded">Help</span>
          </a>
        </nav>
      </div>
      
      <div class="sidebar-footer" *ngIf="expanded && user">
        <div class="user-info">
          <div class="user-avatar">
            <img *ngIf="user.photoURL" [src]="user.photoURL" alt="User Avatar">
            <span *ngIf="!user.photoURL" class="avatar-placeholder">
              {{ user.displayName.charAt(0) }}
            </span>
          </div>
          <div class="user-details">
            <div class="user-name">{{ user.displayName }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100%;
      background-color: var(--primary-dark);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
    }
    
    .sidebar.collapsed {
      width: 64px;
    }
    
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-sm);
      height: 64px;
    }
    
    .brand {
      display: flex;
      align-items: center;
    }
    
    .brand-text {
      margin-left: var(--spacing-sm);
      font-weight: 500;
    }
    
    .toggle-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md) 0;
    }
    
    .sidebar-nav {
      display: flex;
      flex-direction: column;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-lg);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .nav-item.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    .nav-text {
      margin-left: var(--spacing-md);
    }
    
    .sidebar-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
      margin: var(--spacing-md) 0;
    }
    
    .sidebar-footer {
      padding: var(--spacing-md);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .user-info {
      display: flex;
      align-items: center;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: var(--spacing-md);
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
      background-color: var(--primary-light);
      color: white;
      font-weight: 500;
    }
    
    .user-details {
      overflow: hidden;
    }
    
    .user-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .user-email {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        z-index: 1000;
        height: calc(100% - 64px);
        top: 64px;
        left: 0;
        transform: translateX(-100%);
      }
      
      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }
      
      .sidebar.collapsed {
        transform: translateX(-100%);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() expanded = true;
  @Input() user: User | null = null;
  @Output() toggleExpanded = new EventEmitter<void>();
}