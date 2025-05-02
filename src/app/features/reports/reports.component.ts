import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { BudgetService } from '../../core/services/budget.service';
import { Transaction } from '../../models/transaction.model';
import { Budget } from '../../models/budget.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <div class="header-content">
          <h1>Reports & Analytics</h1>
          <p class="subtitle">Analyze your financial data and trends</p>
        </div>
        
        <div class="period-selector">
          <select [formControl]="periodSelect" class="form-control">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      <div class="reports-grid">
        <!-- Income vs Expenses -->
        <div class="report-card">
          <div class="card-header">
            <h2>Income vs Expenses</h2>
            <div class="card-actions">
              <button class="action-btn">
                <span class="material-symbols-outlined">download</span>
              </button>
              <button class="action-btn">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="comparison-stats">
              <div class="stat-item income">
                <div class="stat-label">Total Income</div>
                <div class="stat-value">{{ totalIncome | currency }}</div>
                <div class="stat-trend positive">
                  <span class="material-symbols-outlined">trending_up</span>
                  <span>+{{ incomeTrend }}%</span>
                </div>
              </div>
              
              <div class="stat-item expenses">
                <div class="stat-label">Total Expenses</div>
                <div class="stat-value">{{ totalExpenses | currency }}</div>
                <div class="stat-trend negative">
                  <span class="material-symbols-outlined">trending_down</span>
                  <span>+{{ expenseTrend }}%</span>
                </div>
              </div>
            </div>
            
            <div class="chart-container">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="color-box income"></div>
                  <span>Income</span>
                </div>
                <div class="legend-item">
                  <div class="color-box expenses"></div>
                  <span>Expenses</span>
                </div>
              </div>
              
              <div class="bar-chart">
                <div class="chart-bars">
                  <div *ngFor="let month of monthlyData" class="bar-group">
                    <div class="bar income" [style.height.%]="getBarHeight(month.income)"></div>
                    <div class="bar expenses" [style.height.%]="getBarHeight(month.expenses)"></div>
                  </div>
                </div>
                <div class="chart-labels">
                  <div *ngFor="let month of monthlyData" class="label">{{ month.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Categories -->
        <div class="report-card">
          <div class="card-header">
            <h2>Expense Categories</h2>
            <div class="card-actions">
              <button class="action-btn">
                <span class="material-symbols-outlined">download</span>
              </button>
              <button class="action-btn">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="donut-chart">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#eee" stroke-width="10" />
                
                <ng-container *ngFor="let segment of categorySegments; let i = index">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="transparent"
                    [attr.stroke]="segment.color"
                    stroke-width="10"
                    [attr.stroke-dasharray]="segment.dashArray"
                    [attr.stroke-dashoffset]="segment.dashOffset"
                    class="donut-segment"
                  />
                </ng-container>
              </svg>
              
              <div class="donut-center">
                <div class="total-label">Total</div>
                <div class="total-value">{{ totalExpenses | currency }}</div>
              </div>
            </div>
            
            <div class="category-list">
              <div *ngFor="let category of expenseCategories" class="category-item">
                <div class="category-info">
                  <div class="color-box" [style.background-color]="category.color"></div>
                  <div class="category-name">{{ category.name }}</div>
                  <div class="category-amount">{{ category.amount | currency }}</div>
                </div>
                <div class="category-bar">
                  <div 
                    class="bar" 
                    [style.width.%]="category.percentage"
                    [style.background-color]="category.color"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Performance -->
        <div class="report-card">
          <div class="card-header">
            <h2>Budget Performance</h2>
            <div class="card-actions">
              <button class="action-btn">
                <span class="material-symbols-outlined">download</span>
              </button>
              <button class="action-btn">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="budget-stats">
              <div class="stat-item">
                <div class="stat-label">Total Budgeted</div>
                <div class="stat-value">{{ totalBudgeted | currency }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Total Spent</div>
                <div class="stat-value">{{ totalSpent | currency }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Remaining</div>
                <div class="stat-value" [class.negative]="budgetRemaining < 0">
                  {{ budgetRemaining | currency }}
                </div>
              </div>
            </div>
            
            <div class="budget-categories">
              <div *ngFor="let category of budgetCategories" class="budget-category">
                <div class="category-header">
                  <span class="name">{{ category.name }}</span>
                  <span class="amount">
                    {{ category.spent | currency }} / {{ category.budgeted | currency }}
                  </span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-value" 
                    [style.width.%]="(category.spent / category.budgeted) * 100"
                    [class.warning]="category.spent / category.budgeted > 0.8"
                    [class.danger]="category.spent / category.budgeted > 1"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Savings Analysis -->
        <div class="report-card">
          <div class="card-header">
            <h2>Savings Analysis</h2>
            <div class="card-actions">
              <button class="action-btn">
                <span class="material-symbols-outlined">download</span>
              </button>
              <button class="action-btn">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="savings-stats">
              <div class="stat-item">
                <div class="stat-label">Current Savings Rate</div>
                <div class="stat-value">{{ savingsRate | percent }}</div>
                <div class="stat-trend positive">
                  <span class="material-symbols-outlined">trending_up</span>
                  <span>+{{ savingsTrend }}%</span>
                </div>
              </div>
              
              <div class="savings-chart">
                <div class="target-indicator">
                  <div class="target-line"></div>
                  <div class="target-label">Target: 20%</div>
                </div>
                
                <div class="chart-bars">
                  <div *ngFor="let month of savingsData" class="savings-bar">
                    <div 
                      class="bar" 
                      [style.height.%]="(month.rate * 100) / 0.3"
                      [class.below-target]="month.rate < 0.2"
                    ></div>
                    <div class="label">{{ month.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .reports-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
    }

    .header-content h1 {
      margin-bottom: var(--spacing-xs);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }

    .period-selector {
      min-width: 200px;
    }

    /* Grid Layout */
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    /* Card Styles */
    .report-card {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--box-shadow);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--neutral);
    }

    .card-header h2 {
      margin: 0;
      font-size: var(--font-size-xl);
    }

    .card-actions {
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

    .card-content {
      padding: var(--spacing-lg);
    }

    /* Income vs Expenses */
    .comparison-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .stat-item {
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      background-color: var(--neutral-light);
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-xs);
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .stat-trend.positive {
      color: var(--success);
    }

    .stat-trend.negative {
      color: var(--danger);
    }

    .stat-trend .material-symbols-outlined {
      font-size: var(--font-size-lg);
      margin-right: var(--spacing-xs);
    }

    /* Chart Styles */
    .chart-container {
      margin-top: var(--spacing-lg);
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    .color-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .color-box.income {
      background-color: var(--success);
    }

    .color-box.expenses {
      background-color: var(--danger);
    }

    .bar-chart {
      height: 200px;
      margin-top: var(--spacing-lg);
    }

    .chart-bars {
      height: 100%;
      display: flex;
      align-items: flex-end;
      gap: var(--spacing-md);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--neutral);
    }

    .bar-group {
      flex: 1;
      display: flex;
      gap: 4px;
    }

    .bar {
      flex: 1;
      background-color: var(--neutral);
      border-radius: 2px 2px 0 0;
      transition: height 0.3s ease;
    }

    .bar.income {
      background-color: var(--success);
    }

    .bar.expenses {
      background-color: var(--danger);
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-sm);
    }

    .chart-labels .label {
      flex: 1;
      text-align: center;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    /* Donut Chart */
    .donut-chart {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto var(--spacing-lg);
    }

    .donut-segment {
      transition: stroke-dashoffset 0.3s ease;
    }

    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .total-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .total-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    /* Category List */
    .category-list {
      margin-top: var(--spacing-lg);
    }

    .category-item {
      margin-bottom: var(--spacing-md);
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xs);
    }

    .category-name {
      flex: 1;
      font-weight: var(--font-weight-medium);
    }

    .category-amount {
      color: var(--text-secondary);
    }

    .category-bar {
      height: 4px;
      background-color: var(--neutral-light);
      border-radius: 2px;
      overflow: hidden;
    }

    .category-bar .bar {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    /* Budget Performance */
    .budget-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .budget-stats .stat-item {
      text-align: center;
    }

    .budget-stats .stat-value {
      font-size: var(--font-size-xl);
    }

    .stat-value.negative {
      color: var(--danger);
    }

    .budget-categories {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .budget-category {
      background-color: var(--neutral-light);
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    .progress-bar {
      height: 4px;
      background-color: var(--neutral);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-value {
      height: 100%;
      background-color: var(--primary);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .progress-value.warning {
      background-color: var(--warning);
    }

    .progress-value.danger {
      background-color: var(--danger);
    }

    /* Savings Analysis */
    .savings-stats {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .savings-chart {
      position: relative;
      height: 200px;
      margin-top: var(--spacing-lg);
    }

    .target-indicator {
      position: absolute;
      top: 40%;
      left: 0;
      right: 0;
      z-index: 1;
    }

    .target-line {
      height: 1px;
      background-color: var(--warning);
      border-top: 1px dashed var(--warning);
    }

    .target-label {
      position: absolute;
      right: 0;
      top: -20px;
      font-size: var(--font-size-xs);
      color: var(--warning);
    }

    .savings-chart .chart-bars {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 100%;
      padding: 0 var(--spacing-md);
    }

    .savings-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .savings-bar .bar {
      width: 20px;
      background-color: var(--success);
      border-radius: 2px 2px 0 0;
      transition: height 0.3s ease;
    }

    .savings-bar .bar.below-target {
      background-color: var(--warning);
    }

    .savings-bar .label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    @media (max-width: 1200px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: var(--spacing-md);
      }

      .reports-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .period-selector {
        width: 100%;
      }

      .comparison-stats {
        grid-template-columns: 1fr;
      }

      .budget-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  periodSelect = this.formBuilder.control('30');
  
  // Mock data
  totalIncome = 5000;
  totalExpenses = 3500;
  incomeTrend = 12;
  expenseTrend = 8;
  
  monthlyData = [
    { label: 'Jan', income: 4500, expenses: 3200 },
    { label: 'Feb', income: 4800, expenses: 3400 },
    { label: 'Mar', income: 4600, expenses: 3300 },
    { label: 'Apr', income: 5000, expenses: 3500 },
    { label: 'May', income: 4900, expenses: 3600 },
    { label: 'Jun', income: 5200, expenses: 3800 }
  ];
  
  expenseCategories = [
    { name: 'Housing', amount: 1200, percentage: 35, color: '#4CAF50' },
    { name: 'Food', amount: 800, percentage: 23, color: '#2196F3' },
    { name: 'Transportation', amount: 600, percentage: 17, color: '#FFC107' },
    { name: 'Entertainment', amount: 400, percentage: 11, color: '#9C27B0' },
    { name: 'Other', amount: 500, percentage: 14, color: '#607D8B' }
  ];
  
  categorySegments = [
    { color: '#4CAF50', dashArray: '35 100', dashOffset: '0' },
    { color: '#2196F3', dashArray: '23 100', dashOffset: '-35' },
    { color: '#FFC107', dashArray: '17 100', dashOffset: '-58' },
    { color: '#9C27B0', dashArray: '11 100', dashOffset: '-75' },
    { color: '#607D8B', dashArray: '14 100', dashOffset: '-86' }
  ];
  
  totalBudgeted = 4000;
  totalSpent = 3500;
  budgetRemaining = 500;
  
  budgetCategories = [
    { name: 'Housing', budgeted: 1500, spent: 1200 },
    { name: 'Food', budgeted: 800, spent: 750 },
    { name: 'Transportation', budgeted: 600, spent: 580 },
    { name: 'Entertainment', budgeted: 400, spent: 420 },
    { name: 'Other', budgeted: 700, spent: 550 }
  ];
  
  savingsRate = 0.18;
  savingsTrend = 5;
  
  savingsData = [
    { label: 'Jan', rate: 0.15 },
    { label: 'Feb', rate: 0.17 },
    { label: 'Mar', rate: 0.16 },
    { label: 'Apr', rate: 0.19 },
    { label: 'May', rate: 0.18 },
    { label: 'Jun', rate: 0.21 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    // In a real app, this would load data from services based on selected period
  }

  getBarHeight(value: number): number {
    const maxValue = Math.max(
      ...this.monthlyData.map(d => Math.max(d.income, d.expenses))
    );
    return (value / maxValue) * 100;
  }
}