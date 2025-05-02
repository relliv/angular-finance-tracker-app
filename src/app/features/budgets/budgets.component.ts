import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Budget, BudgetCategory } from '../../models/budget.model';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="budgets-container">
      <div class="budgets-header">
        <div class="header-content">
          <h1>Budgets</h1>
          <p class="subtitle">Plan and track your spending</p>
        </div>
        <button class="btn btn-primary" (click)="showAddBudget = true">
          <span class="material-symbols-outlined">add</span>
          Create Budget
        </button>
      </div>

      <!-- Add Budget Modal -->
      <div class="modal" *ngIf="showAddBudget">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Create New Budget</h2>
            <button class="close-btn" (click)="showAddBudget = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form [formGroup]="budgetForm" (ngSubmit)="createBudget()" class="budget-form">
            <div class="form-group">
              <label for="name">Budget Name</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                placeholder="e.g., Monthly Budget"
              >
            </div>

            <div class="form-group">
              <label for="amount">Total Budget Amount</label>
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
              <label for="period">Budget Period</label>
              <select id="period" formControlName="period" class="form-control">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div class="form-group">
              <label>Category Allocation</label>
              <div class="categories-list" formArrayName="categories">
                <div *ngFor="let category of categories" class="category-item">
                  <div class="category-header">
                    <span class="category-name" [style.color]="category.color">
                      {{ category.name }}
                    </span>
                    <input 
                      type="number" 
                      [formControlName]="category.id"
                      class="form-control category-amount"
                      placeholder="Amount"
                      step="0.01"
                      (input)="updateTotalAllocation()"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="allocation-summary">
              <div class="allocation-item">
                <span>Total Budget:</span>
                <span>{{ budgetForm.get('amount')?.value | currency }}</span>
              </div>
              <div class="allocation-item">
                <span>Allocated:</span>
                <span>{{ totalAllocated | currency }}</span>
              </div>
              <div class="allocation-item" [class.warning]="remainingToAllocate < 0">
                <span>Remaining:</span>
                <span>{{ remainingToAllocate | currency }}</span>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="showAddBudget = false">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="!budgetForm.valid || remainingToAllocate !== 0"
              >
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Budgets List -->
      <div class="budgets-grid">
        <div *ngFor="let budget of budgets" class="budget-card">
          <div class="budget-header">
            <h3>{{ budget.name }}</h3>
            <div class="budget-actions">
              <button class="action-btn" (click)="editBudget(budget)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="action-btn delete" (click)="deleteBudget(budget)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

          <div class="budget-overview">
            <div class="budget-total">
              <span class="label">Total Budget</span>
              <span class="amount">{{ budget.amount | currency }}</span>
            </div>
            
            <div class="budget-progress">
              <div class="progress-bar">
                <div 
                  class="progress-value" 
                  [style.width.%]="getBudgetProgress(budget)"
                  [class.warning]="getBudgetProgress(budget) > 70"
                  [class.danger]="getBudgetProgress(budget) > 90"
                ></div>
              </div>
              <div class="progress-label">
                {{ getBudgetProgress(budget) | number:'1.0-0' }}% Used
              </div>
            </div>
          </div>

          <div class="categories-breakdown">
            <div *ngFor="let category of budget.categories" class="category-progress">
              <div class="category-header">
                <span class="category-name">{{ getCategoryName(category.categoryId) }}</span>
                <span class="category-amount">
                  {{ category.spent | currency }} / {{ category.amount | currency }}
                </span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-value"
                  [style.width.%]="(category.spent / category.amount) * 100"
                  [style.background-color]="getCategoryColor(category.categoryId)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .budgets-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .budgets-header {
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
      max-width: 600px;
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
    .budget-form {
      padding: var(--spacing-lg);
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

    .categories-list {
      margin-top: var(--spacing-md);
      border: 1px solid var(--neutral);
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }

    .category-item {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--neutral);
    }

    .category-item:last-child {
      border-bottom: none;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-name {
      font-weight: var(--font-weight-medium);
    }

    .category-amount {
      width: 120px;
    }

    .allocation-summary {
      margin-top: var(--spacing-lg);
      padding: var(--spacing-md);
      background-color: var(--neutral-light);
      border-radius: var(--border-radius-md);
    }

    .allocation-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }

    .allocation-item:last-child {
      margin-bottom: 0;
      font-weight: var(--font-weight-medium);
    }

    .allocation-item.warning {
      color: var(--danger);
    }

    /* Budgets Grid */
    .budgets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .budget-card {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--box-shadow);
    }

    .budget-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .budget-header h3 {
      margin: 0;
      font-size: var(--font-size-xl);
    }

    .budget-actions {
      display: flex;
      gap: var(--spacing-sm);
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
      background-color: var(--neutral-light);
    }

    .action-btn.delete:hover {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }

    .budget-overview {
      margin-bottom: var(--spacing-lg);
    }

    .budget-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .budget-total .label {
      color: var(--text-secondary);
    }

    .budget-total .amount {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
    }

    .budget-progress {
      margin-bottom: var(--spacing-md);
    }

    .progress-bar {
      height: 8px;
      background-color: var(--neutral-light);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .progress-value {
      height: 100%;
      background-color: var(--primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-value.warning {
      background-color: var(--warning);
    }

    .progress-value.danger {
      background-color: var(--danger);
    }

    .progress-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-align: right;
    }

    .categories-breakdown {
      border-top: 1px solid var(--neutral);
      padding-top: var(--spacing-md);
    }

    .category-progress {
      margin-bottom: var(--spacing-md);
    }

    .category-progress:last-child {
      margin-bottom: 0;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
    }

    .category-amount {
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .budgets-container {
        padding: var(--spacing-md);
      }

      .budgets-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .budgets-grid {
        grid-template-columns: 1fr;
      }

      .budget-card {
        padding: var(--spacing-md);
      }
    }
  `]
})
export class BudgetsComponent implements OnInit {
  showAddBudget = false;
  budgetForm: FormGroup;
  budgets: Budget[] = [];
  categories: any[] = [];
  totalAllocated = 0;
  remainingToAllocate = 0;

  constructor(
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private transactionService: TransactionService
  ) {
    this.budgetForm = this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      period: ['monthly', Validators.required],
      categories: this.formBuilder.group({})
    });
  }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadCategories();

    // Watch for amount changes to update remaining allocation
    this.budgetForm.get('amount')?.valueChanges.subscribe(() => {
      this.updateTotalAllocation();
    });
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
    });
  }

  loadCategories(): void {
    this.transactionService.getCategories().subscribe(categories => {
      this.categories = categories;
      
      // Create form controls for each category
      const categoryControls: { [key: string]: any } = {};
      categories.forEach(category => {
        categoryControls[category.id] = [''];
      });
      
      this.budgetForm.setControl('categories', this.formBuilder.group(categoryControls));
    });
  }

  updateTotalAllocation(): void {
    const totalBudget = this.budgetForm.get('amount')?.value || 0;
    const categoryValues = this.budgetForm.get('categories')?.value || {};
    
    this.totalAllocated = Object.values(categoryValues)
      .reduce((sum: number, value: any) => sum + (Number(value) || 0), 0);
    
    this.remainingToAllocate = totalBudget - this.totalAllocated;
  }

  createBudget(): void {
    if (this.budgetForm.valid && this.remainingToAllocate === 0) {
      const formValues = this.budgetForm.value;
      const categoryValues = formValues.categories;

      const categories: BudgetCategory[] = Object.keys(categoryValues)
        .filter(categoryId => categoryValues[categoryId])
        .map(categoryId => ({
          categoryId,
          amount: Number(categoryValues[categoryId]),
          spent: 0
        }));

      const newBudget: Omit<Budget, 'id'> = {
        userId: '1', // In a real app, this would come from the authenticated user
        name: formValues.name,
        amount: formValues.amount,
        period: formValues.period,
        startDate: new Date(),
        categories
      };

      this.budgetService.addBudget(newBudget).subscribe(() => {
        this.showAddBudget = false;
        this.budgetForm.reset({
          period: 'monthly',
          categories: {}
        });
        this.loadBudgets();
      });
    }
  }

  editBudget(budget: Budget): void {
    // Implement edit functionality
    console.log('Edit budget:', budget);
  }

  deleteBudget(budget: Budget): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(budget.id).subscribe(() => {
        this.loadBudgets();
      });
    }
  }

  getBudgetProgress(budget: Budget): number {
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
    return (totalSpent / budget.amount) * 100;
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