import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Transaction } from '../../../../models/transaction.model';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="component-container">
      <div class="component-header">
        <h2>Recent Transactions</h2>
        <a routerLink="/transactions" class="view-all">View All</a>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading transactions...</p>
      </div>
      
      <ng-container *ngIf="!loading">
        <div *ngIf="transactions && transactions.length > 0; else noTransactions" class="transactions-list">
          <div *ngFor="let transaction of transactions" class="transaction-item">
            <div class="transaction-icon" [ngClass]="transaction.type">
              <span class="material-symbols-outlined">
                {{ transaction.type === 'income' ? 'trending_up' : 'trending_down' }}
              </span>
            </div>
            <div class="transaction-details">
              <div class="transaction-title">{{ transaction.description }}</div>
              <div class="transaction-category">{{ getCategoryName(transaction.category) }}</div>
              <div class="transaction-date">{{ transaction.date | date: 'MMM d, y' }}</div>
            </div>
            <div class="transaction-amount" [ngClass]="transaction.type">
              {{ transaction.type === 'income' ? '+' : '-' }} {{ transaction.amount | currency }}
            </div>
          </div>
        </div>
        
        <ng-template #noTransactions>
          <div class="empty-state">
            <span class="material-symbols-outlined">receipt_long</span>
            <h3>No Transactions</h3>
            <p>You haven't added any transactions yet.</p>
            <a routerLink="/transactions/add" class="btn btn-primary">Add Transaction</a>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [`
    .component-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .component-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .view-all {
      font-size: 0.875rem;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(63, 81, 181, 0.3);
      border-radius: 50%;
      border-top-color: var(--primary);
      animation: spin 1s linear infinite;
      margin-bottom: var(--spacing-md);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .transactions-list {
      flex: 1;
      overflow-y: auto;
    }
    
    .transaction-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--neutral-light);
    }
    
    .transaction-item:last-child {
      border-bottom: none;
    }
    
    .transaction-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: var(--spacing-md);
    }
    
    .transaction-icon.income {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success);
    }
    
    .transaction-icon.expense {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }
    
    .transaction-details {
      flex: 1;
    }
    
    .transaction-title {
      font-weight: 500;
      margin-bottom: 2px;
    }
    
    .transaction-category {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 2px;
    }
    
    .transaction-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .transaction-amount {
      font-weight: 500;
      text-align: right;
    }
    
    .transaction-amount.income {
      color: var(--success);
    }
    
    .transaction-amount.expense {
      color: var(--danger);
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-xl) 0;
    }
    
    .empty-state .material-symbols-outlined {
      font-size: 3rem;
      color: var(--neutral-dark);
      margin-bottom: var(--spacing-md);
    }
    
    .empty-state h3 {
      margin-bottom: var(--spacing-sm);
    }
    
    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
    }
  `]
})
export class RecentTransactionsComponent {
  @Input() transactions: Transaction[] = [];
  @Input() loading = false;
  
  constructor(private transactionService: TransactionService) {}
  
  getCategoryName(categoryId: string): string {
    const category = this.transactionService.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }
}