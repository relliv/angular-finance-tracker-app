import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BudgetSummary } from '../../../../models/budget.model';

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="component-container">
      <div class="component-header">
        <h2>Monthly Budget</h2>
        <a routerLink="/budgets" class="view-all">View All</a>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading budget data...</p>
      </div>
      
      <ng-container *ngIf="!loading">
        <div *ngIf="budgetSummary; else noBudget" class="budget-content">
          <div class="budget-overview">
            <div class="budget-progress">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path 
                  [class]="getProgressClass(budgetSummary.spentPercentage)"
                  [attr.stroke-dasharray]="getProgressValue(budgetSummary.spentPercentage) + ', 100'"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" class="percentage">{{ budgetSummary.spentPercentage | number: '1.0-0' }}%</text>
              </svg>
              <div class="budget-summary">
                <div class="budget-total">
                  <span class="label">Total Budget:</span>
                  <span class="value">{{ budgetSummary.totalBudget | currency }}</span>
                </div>
                <div class="budget-spent">
                  <span class="label">Spent:</span>
                  <span class="value">{{ budgetSummary.totalSpent | currency }}</span>
                </div>
                <div class="budget-remaining">
                  <span class="label">Remaining:</span>
                  <span class="value">{{ budgetSummary.totalBudget - budgetSummary.totalSpent | currency }}</span>
                </div>
              </div>
            </div>
            
            <div class="budget-categories">
              <h3>Top Categories</h3>
              <div class="category-list">
                <div *ngFor="let category of budgetSummary.categorySummaries" class="category-item">
                  <div class="category-info">
                    <div class="category-name">{{ category.name }}</div>
                    <div class="category-amount">
                      <span>{{ category.spent | currency }} / {{ category.budgeted | currency }}</span>
                    </div>
                  </div>
                  <div class="category-progress">
                    <div class="progress-bar">
                      <div 
                        class="progress-value" 
                        [style.width.%]="category.percentage"
                        [style.background-color]="category.color"
                      ></div>
                    </div>
                    <div class="progress-percentage" [style.color]="category.color">
                      {{ category.percentage | number: '1.0-0' }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #noBudget>
          <div class="empty-state">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <h3>No Budget Setup</h3>
            <p>You haven't set up a budget for this month yet.</p>
            <a routerLink="/budgets/create" class="btn btn-primary">Create Budget</a>
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
    
    .budget-content {
      flex: 1;
    }
    
    .budget-overview {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .budget-progress {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }
    
    .circular-chart {
      width: 150px;
      height: 150px;
    }
    
    .circle-bg {
      fill: none;
      stroke: #eee;
      stroke-width: 3.8;
    }
    
    .circle-progress {
      fill: none;
      stroke-width: 3.8;
      stroke-linecap: round;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      transition: stroke-dasharray 0.3s ease;
    }
    
    .circle-progress.good {
      stroke: var(--success);
    }
    
    .circle-progress.warning {
      stroke: var(--warning);
    }
    
    .circle-progress.danger {
      stroke: var(--danger);
    }
    
    .percentage {
      fill: var(--text-primary);
      font-size: 0.5em;
      text-anchor: middle;
      font-weight: 500;
    }
    
    .budget-summary {
      flex: 1;
    }
    
    .budget-total, .budget-spent, .budget-remaining {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }
    
    .label {
      color: var(--text-secondary);
    }
    
    .value {
      font-weight: 500;
    }
    
    .budget-categories h3 {
      font-size: 1rem;
      margin-bottom: var(--spacing-md);
    }
    
    .category-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .category-item {
      display: flex;
      flex-direction: column;
    }
    
    .category-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .category-name {
      font-weight: 500;
    }
    
    .category-amount {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .category-progress {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .progress-bar {
      flex: 1;
      height: 8px;
      background-color: var(--neutral-light);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-value {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .progress-percentage {
      font-size: 0.75rem;
      font-weight: 500;
      min-width: 40px;
      text-align: right;
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
    
    @media (max-width: 768px) {
      .budget-progress {
        flex-direction: column;
      }
    }
  `]
})
export class BudgetOverviewComponent {
  @Input() budgetSummary: BudgetSummary | null = null;
  @Input() loading = false;
  
  getProgressValue(percentage: number): number {
    return Math.min(percentage, 100);
  }
  
  getProgressClass(percentage: number): string {
    if (percentage < 70) {
      return 'circle-progress good';
    } else if (percentage < 90) {
      return 'circle-progress warning';
    } else {
      return 'circle-progress danger';
    }
  }
}