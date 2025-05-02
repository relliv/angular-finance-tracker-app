import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../models/transaction.model';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <div class="component-header">
        <h2>Expense Summary</h2>
        <div class="period-selector">
          <button 
            *ngFor="let period of periods" 
            [class.active]="selectedPeriod === period.value"
            (click)="selectPeriod(period.value)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-legend">
          <div *ngFor="let category of topCategories" class="legend-item">
            <div class="color-box" [style.background-color]="category.color"></div>
            <div class="legend-label">{{ category.name }}</div>
            <div class="legend-value">{{ category.percentage | number: '1.0-0' }}%</div>
          </div>
        </div>
        
        <div class="pie-chart">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eee" stroke-width="20" />
            
            <ng-container *ngFor="let segment of pieSegments; let i = index">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent"
                [attr.stroke]="segment.color"
                stroke-width="20"
                [attr.stroke-dasharray]="segment.dashArray"
                [attr.stroke-dashoffset]="segment.dashOffset"
                class="pie-segment"
              />
            </ng-container>
          </svg>
          
          <div class="chart-center">
            <div class="total-label">Total</div>
            <div class="total-amount">{{ totalExpenses | currency }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .component-container {
      height: 100%;
    }
    
    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    
    .component-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .period-selector {
      display: flex;
      background-color: var(--neutral-light);
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }
    
    .period-selector button {
      background: none;
      border: none;
      padding: var(--spacing-sm) var(--spacing-md);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .period-selector button.active {
      background-color: var(--primary);
      color: white;
    }
    
    .chart-container {
      display: flex;
      height: 250px;
    }
    
    .chart-legend {
      width: 40%;
      padding-right: var(--spacing-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }
    
    .color-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-right: var(--spacing-sm);
    }
    
    .legend-label {
      flex: 1;
      font-size: 0.875rem;
    }
    
    .legend-value {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .pie-chart {
      width: 60%;
      position: relative;
    }
    
    .pie-chart svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .pie-segment {
      transition: stroke-dashoffset 0.5s ease-out;
    }
    
    .chart-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    
    .total-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .total-amount {
      font-size: 1.125rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .chart-container {
        flex-direction: column-reverse;
        height: auto;
      }
      
      .chart-legend, .pie-chart {
        width: 100%;
      }
      
      .chart-legend {
        margin-top: var(--spacing-md);
      }
      
      .pie-chart {
        height: 200px;
      }
    }
  `]
})
export class ExpenseSummaryComponent implements OnChanges {
  @Input() transactions: Transaction[] = [];
  
  periods = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];
  
  selectedPeriod = 'month';
  topCategories: { id: string, name: string, amount: number, percentage: number, color: string }[] = [];
  totalExpenses = 0;
  pieSegments: { color: string, dashArray: string, dashOffset: string }[] = [];
  
  constructor(private transactionService: TransactionService) {}
  
  ngOnChanges(): void {
    this.calculateExpenses();
  }
  
  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.calculateExpenses();
  }
  
  private calculateExpenses(): void {
    // Filter expenses based on selected period
    const now = new Date();
    let startDate = new Date();
    
    switch (this.selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Get expenses in period
    const expenses = this.transactions.filter(t => 
      t.type === 'expense' && new Date(t.date) >= startDate
    );
    
    // Calculate total
    this.totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Group by category
    const categories: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    
    // Transform to array and calculate percentages
    this.topCategories = Object.keys(categories)
      .map(categoryId => {
        const category = this.transactionService.categories.find(c => c.id === categoryId);
        return {
          id: categoryId,
          name: category?.name || 'Uncategorized',
          amount: categories[categoryId],
          percentage: (categories[categoryId] / this.totalExpenses) * 100,
          color: category?.color || '#9e9e9e'
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Calculate pie chart segments
    const circumference = 2 * Math.PI * 40; // 2πr
    
    let offset = 0;
    this.pieSegments = this.topCategories.map(category => {
      const segmentLength = (category.percentage / 100) * circumference;
      const segment = {
        color: category.color,
        dashArray: `${segmentLength} ${circumference - segmentLength}`,
        dashOffset: `${-offset}`
      };
      offset += segmentLength;
      return segment;
    });
  }
}