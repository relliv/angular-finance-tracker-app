import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction, TransactionCategory } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="transactions-container">
      <div class="transactions-header">
        <div class="header-content">
          <h1>Transactions</h1>
          <p class="subtitle">Manage your income and expenses</p>
        </div>
        <button class="btn btn-primary" (click)="showAddTransaction = true">
          <span class="material-symbols-outlined">add</span>
          Add Transaction
        </button>
      </div>

      <!-- Add Transaction Form -->
      <div class="modal" *ngIf="showAddTransaction">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Add Transaction</h2>
            <button class="close-btn" (click)="showAddTransaction = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form [formGroup]="transactionForm" (ngSubmit)="addTransaction()" class="transaction-form">
            <div class="form-group">
              <label for="type">Type</label>
              <div class="type-selector">
                <button 
                  type="button"
                  [class.active]="transactionForm.get('type')?.value === 'income'"
                  (click)="transactionForm.patchValue({ type: 'income' })"
                >Income</button>
                <button 
                  type="button"
                  [class.active]="transactionForm.get('type')?.value === 'expense'"
                  (click)="transactionForm.patchValue({ type: 'expense' })"
                >Expense</button>
              </div>
            </div>

            <div class="form-group">
              <label for="amount">Amount</label>
              <div class="amount-input">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  id="amount" 
                  formControlName="amount" 
                  class="form-control"
                  placeholder="0.00"
                  step="0.01"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="">Select a category</option>
                <option 
                  *ngFor="let category of categories" 
                  [value]="category.id"
                  [style.color]="category.color"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <input 
                type="text" 
                id="description" 
                formControlName="description" 
                class="form-control"
                placeholder="Enter description"
              >
            </div>

            <div class="form-group">
              <label for="date">Date</label>
              <input 
                type="date" 
                id="date" 
                formControlName="date" 
                class="form-control"
              >
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isRecurring">
                <span>Recurring Transaction</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="showAddTransaction = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!transactionForm.valid">
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            [(ngModel)]="searchQuery"
            (input)="filterTransactions()"
          >
        </div>

        <div class="filter-group">
          <select [(ngModel)]="selectedType" (change)="filterTransactions()">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select [(ngModel)]="selectedCategory" (change)="filterTransactions()">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>

          <select [(ngModel)]="selectedPeriod" (change)="filterTransactions()">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="transactions-list">
        <div class="transaction-item" *ngFor="let transaction of filteredTransactions">
          <div class="transaction-icon" [ngClass]="transaction.type">
            <span class="material-symbols-outlined">
              {{ transaction.type === 'income' ? 'trending_up' : 'trending_down' }}
            </span>
          </div>

          <div class="transaction-details">
            <div class="transaction-main">
              <span class="description">{{ transaction.description }}</span>
              <span class="amount" [ngClass]="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }} {{ transaction.amount | currency }}
              </span>
            </div>

            <div class="transaction-meta">
              <span class="category" [style.color]="getCategoryColor(transaction.category)">
                {{ getCategoryName(transaction.category) }}
              </span>
              <span class="date">{{ transaction.date | date:'MMM d, y' }}</span>
            </div>
          </div>

          <div class="transaction-actions">
            <button class="action-btn" (click)="editTransaction(transaction)">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="action-btn delete" (click)="deleteTransaction(transaction)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .header-content h1 {
      margin-bottom: var(--spacing-xs);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--neutral);
    }

    .modal-header h2 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
    }

    /* Form Styles */
    .transaction-form {
      padding: var(--spacing-lg);
    }

    .type-selector {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .type-selector button {
      flex: 1;
      padding: var(--spacing-md);
      border: 1px solid var(--neutral);
      background: none;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .type-selector button.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .amount-input {
      position: relative;
    }

    .currency {
      position: absolute;
      left: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    .amount-input input {
      padding-left: calc(var(--spacing-md) * 2 + 8px);
    }

    /* Filters */
    .filters {
      background-color: var(--background);
      padding: var(--spacing-lg);
      border-radius: var(--border-radius-lg);
      margin-bottom: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
    }

    .search-box {
      flex: 1;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) calc(var(--spacing-xl) + var(--spacing-sm));
      border: 1px solid var(--neutral);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-base);
    }

    .search-box .material-symbols-outlined {
      position: absolute;
      left: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    .filter-group {
      display: flex;
      gap: var(--spacing-md);
    }

    .filter-group select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--neutral);
      border-radius: var(--border-radius-sm);
      background-color: var(--background);
      font-size: var(--font-size-base);
    }

    /* Transactions List */
    .transactions-list {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--neutral-light);
      transition: background-color 0.2s ease;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-item:hover {
      background-color: var(--neutral-light);
    }

    .transaction-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--spacing-lg);
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

    .transaction-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xs);
    }

    .description {
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .amount {
      font-weight: var(--font-weight-semibold);
    }

    .amount.income {
      color: var(--success);
    }

    .amount.expense {
      color: var(--danger);
    }

    .transaction-meta {
      display: flex;
      gap: var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .transaction-actions {
      display: flex;
      gap: var(--spacing-sm);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .transaction-item:hover .transaction-actions {
      opacity: 1;
    }

    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: var(--neutral);
    }

    .action-btn.delete:hover {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }

    @media (max-width: 768px) {
      .transactions-container {
        padding: var(--spacing-md);
      }

      .transactions-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .filter-group {
        flex-wrap: wrap;
      }

      .filter-group select {
        flex: 1;
        min-width: 150px;
      }

      .transaction-actions {
        opacity: 1;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  showAddTransaction = false;
  transactionForm: FormGroup;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: TransactionCategory[] = [];

  // Filters
  searchQuery = '';
  selectedType = '';
  selectedCategory = '';
  selectedPeriod = 'all';

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.formBuilder.group({
      type: ['expense', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      isRecurring: [false]
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.filterTransactions();
    });
  }

  loadCategories(): void {
    this.transactionService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addTransaction(): void {
    if (this.transactionForm.valid) {
      const newTransaction = {
        ...this.transactionForm.value,
        date: new Date(this.transactionForm.value.date)
      };

      this.transactionService.addTransaction(newTransaction).subscribe(() => {
        this.showAddTransaction = false;
        this.transactionForm.reset({
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
          isRecurring: false
        });
        this.loadTransactions();
      });
    }
  }

  editTransaction(transaction: Transaction): void {
    // Implement edit functionality
    console.log('Edit transaction:', transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(transaction.id).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  filterTransactions(): void {
    let filtered = [...this.transactions];

    // Search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        this.getCategoryName(t.category).toLowerCase().includes(query)
      );
    }

    // Type filter
    if (this.selectedType) {
      filtered = filtered.filter(t => t.type === this.selectedType);
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }

    // Period filter
    const today = new Date();
    switch (this.selectedPeriod) {
      case 'today':
        filtered = filtered.filter(t => 
          new Date(t.date).toDateString() === today.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(t => 
          new Date(t.date).getMonth() === today.getMonth() &&
          new Date(t.date).getFullYear() === today.getFullYear()
        );
        break;
      case 'year':
        filtered = filtered.filter(t => 
          new Date(t.date).getFullYear() === today.getFullYear()
        );
        break;
    }

    this.filteredTransactions = filtered;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  getCategoryColor(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#9e9e9e';
  }
}