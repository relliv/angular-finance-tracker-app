import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { BudgetService } from '../../core/services/budget.service';
import { GoalService } from '../../core/services/goal.service';
import { Transaction } from '../../models/transaction.model';
import { Budget, BudgetSummary } from '../../models/budget.model';
import { FinancialGoal } from '../../models/goal.model';
import { BudgetOverviewComponent } from './components/budget-overview/budget-overview.component';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary.component';
import { GoalProgressComponent } from './components/goal-progress/goal-progress.component';
import { BalanceTrendComponent } from './components/balance-trend/balance-trend.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BudgetOverviewComponent,
    RecentTransactionsComponent,
    ExpenseSummaryComponent,
    GoalProgressComponent,
    BalanceTrendComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div class="date-display">{{ currentDate | date: 'longDate' }}</div>
      </div>
      
      <div class="summary-cards">
        <div class="summary-card income">
          <div class="card-icon">
            <span class="material-symbols-outlined">trending_up</span>
          </div>
          <div class="card-content">
            <h3>Income</h3>
            <div class="card-amount">{{ totalIncome | currency }}</div>
            <div class="card-trend positive">
              <span class="material-symbols-outlined">arrow_upward</span>
              <span>{{ incomeTrend }}%</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card expenses">
          <div class="card-icon">
            <span class="material-symbols-outlined">trending_down</span>
          </div>
          <div class="card-content">
            <h3>Expenses</h3>
            <div class="card-amount">{{ totalExpenses | currency }}</div>
            <div class="card-trend" [class.positive]="expenseTrend < 0" [class.negative]="expenseTrend > 0">
              <span class="material-symbols-outlined">{{ expenseTrend < 0 ? 'arrow_downward' : 'arrow_upward' }}</span>
              <span>{{ expenseTrend | number: '1.0-0' }}%</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card balance">
          <div class="card-icon">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div class="card-content">
            <h3>Balance</h3>
            <div class="card-amount">{{ balance | currency }}</div>
            <div class="card-trend" [class.positive]="balanceTrend > 0" [class.negative]="balanceTrend < 0">
              <span class="material-symbols-outlined">{{ balanceTrend > 0 ? 'arrow_upward' : 'arrow_downward' }}</span>
              <span>{{ balanceTrend | number: '1.0-0' }}%</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card savings">
          <div class="card-icon">
            <span class="material-symbols-outlined">savings</span>
          </div>
          <div class="card-content">
            <h3>Savings Rate</h3>
            <div class="card-amount">{{ savingsRate | percent }}</div>
            <div class="target-indicator">
              <div class="target-bar">
                <div class="target-progress" [style.width.%]="savingsRatePercentage"></div>
              </div>
              <div class="target-text">Target: 20%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <app-budget-overview 
          class="dashboard-item budget-overview"
          [budgetSummary]="budgetSummary"
          [loading]="loadingBudget"
        ></app-budget-overview>
        
        <app-expense-summary 
          class="dashboard-item expense-summary"
          [transactions]="transactions"
        ></app-expense-summary>
        
        <app-recent-transactions 
          class="dashboard-item recent-transactions"
          [transactions]="recentTransactions"
          [loading]="loadingTransactions"
        ></app-recent-transactions>
        
        <app-goal-progress 
          class="dashboard-item goal-progress"
          [goals]="goals"
          [loading]="loadingGoals"
        ></app-goal-progress>
        
        <app-balance-trend 
          class="dashboard-item balance-trend"
          [transactions]="transactions"
        ></app-balance-trend>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--spacing-md);
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    
    .dashboard-header h1 {
      margin: 0;
      font-size: var(--font-size-2xl);
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
    }
    
    .date-display {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    
    .summary-card {
      display: flex;
      align-items: center;
      background-color: var(--background);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--box-shadow);
      transition: transform 0.2s ease;
    }
    
    .summary-card:hover {
      transform: translateY(-2px);
    }
    
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--spacing-md);
      transition: all 0.2s ease;
    }
    
    .income .card-icon {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success);
    }
    
    .expenses .card-icon {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }
    
    .balance .card-icon {
      background-color: rgba(63, 81, 181, 0.1);
      color: var(--primary);
    }
    
    .savings .card-icon {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning);
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-content h3 {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-weight: var(--font-weight-medium);
    }
    
    .card-amount {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 4px;
      line-height: var(--line-height-tight);
    }
    
    .card-trend {
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
    
    .card-trend.positive {
      color: var(--success);
    }
    
    .card-trend.negative {
      color: var(--danger);
    }
    
    .card-trend .material-symbols-outlined {
      font-size: var(--font-size-base);
      margin-right: 4px;
    }
    
    .target-indicator {
      margin-top: 8px;
    }
    
    .target-bar {
      height: 4px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 4px;
    }
    
    .target-progress {
      height: 100%;
      background-color: var(--warning);
      transition: width 0.3s ease;
    }
    
    .target-text {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: auto auto auto;
      gap: var(--spacing-md);
    }
    
    .dashboard-item {
      background-color: var(--background);
      border-radius: var(--border-radius-md);
      box-shadow: var(--box-shadow);
      padding: var(--spacing-lg);
      transition: transform 0.2s ease;
    }
    
    .dashboard-item:hover {
      transform: translateY(-2px);
    }
    
    .budget-overview {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    
    .expense-summary {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
    
    .balance-trend {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
    
    .recent-transactions {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    
    .goal-progress {
      grid-column: 2 / 3;
      grid-row: 2 / 4;
    }
    
    @media (max-width: 1200px) {
      .summary-cards {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }
      
      .dashboard-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      
      .budget-overview,
      .expense-summary,
      .balance-trend,
      .recent-transactions,
      .goal-progress {
        grid-column: 1;
      }
      
      .budget-overview { grid-row: 1; }
      .recent-transactions { grid-row: 2; }
      .expense-summary { grid-row: 3; }
      .goal-progress { grid-row: 4; }
      .balance-trend { grid-row: 5; }
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-sm);
      }
      
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
        margin-bottom: var(--spacing-md);
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }
      
      .summary-card {
        padding: var(--spacing-sm);
      }
      
      .card-icon {
        width: 40px;
        height: 40px;
      }
      
      .card-amount {
        font-size: var(--font-size-lg);
      }
      
      .dashboard-grid {
        gap: var(--spacing-sm);
      }
      
      .dashboard-item {
        padding: var(--spacing-md);
      }
      
      .dashboard-item:hover {
        transform: none;
      }
    }
    
    @media (max-width: 480px) {
      .card-content h3 {
        font-size: var(--font-size-xs);
      }
      
      .card-amount {
        font-size: var(--font-size-base);
      }
      
      .card-trend {
        font-size: var(--font-size-xs);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  
  // Summary metrics
  totalIncome = 1200;
  totalExpenses = 1170;
  balance = 30;
  savingsRate = 0.15;
  incomeTrend = 5;
  expenseTrend = 3;
  balanceTrend = 8;
  savingsRatePercentage = 75;
  
  // Data
  transactions: Transaction[] = [];
  recentTransactions: Transaction[] = [];
  currentBudget: Budget | null = null;
  budgetSummary: BudgetSummary | null = null;
  goals: FinancialGoal[] = [];
  
  // Loading states
  loadingTransactions = true;
  loadingBudget = true;
  loadingGoals = true;
  
  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private goalService: GoalService
  ) {}
  
  ngOnInit(): void {
    this.loadTransactions();
    this.loadBudget();
    this.loadGoals();
  }
  
  private loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      this.loadingTransactions = false;
      
      // Update summary metrics
      this.calculateSummaryMetrics();
    });
  }
  
  private loadBudget(): void {
    this.budgetService.getCurrentBudget().subscribe(budget => {
      this.currentBudget = budget || null;
      
      if (budget) {
        this.budgetService.getBudgetSummary(budget.id).subscribe(summary => {
          this.budgetSummary = summary;
          this.loadingBudget = false;
        });
      } else {
        this.loadingBudget = false;
      }
    });
  }
  
  private loadGoals(): void {
    this.goalService.getGoals().subscribe(goals => {
      this.goals = goals;
      this.loadingGoals = false;
    });
  }
  
  private calculateSummaryMetrics(): void {
    // Calculate income and expenses
    const incomeTransactions = this.transactions.filter(t => t.type === 'income');
    const expenseTransactions = this.transactions.filter(t => t.type === 'expense');
    
    this.totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    this.totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    this.balance = this.totalIncome - this.totalExpenses;
    
    // Calculate savings rate
    this.savingsRate = this.totalIncome > 0 ? this.balance / this.totalIncome : 0;
    this.savingsRatePercentage = (this.savingsRate / 0.2) * 100; // Target is 20%
  }
}