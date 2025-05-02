import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../models/transaction.model';

@Component({
  selector: 'app-balance-trend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <div class="component-header">
        <h2>Balance Trend</h2>
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
          <div class="legend-item">
            <div class="color-box income"></div>
            <div class="legend-label">Income</div>
          </div>
          <div class="legend-item">
            <div class="color-box expenses"></div>
            <div class="legend-label">Expenses</div>
          </div>
          <div class="legend-item">
            <div class="color-box balance"></div>
            <div class="legend-label">Balance</div>
          </div>
        </div>
        
        <div class="chart-area">
          <div class="y-axis">
            <div *ngFor="let tick of yAxisTicks" class="y-tick">
              {{ tick | currency:'USD':'symbol':'1.0-0' }}
            </div>
          </div>
          
          <div class="chart">
            <svg width="100%" height="200">
              <!-- Income bars -->
              <g>
                <rect *ngFor="let bar of incomeBars" 
                  [attr.x]="bar.x" 
                  [attr.y]="bar.y" 
                  [attr.width]="bar.width" 
                  [attr.height]="bar.height"
                  class="income-bar"
                  rx="2"
                >
                </rect>
              </g>
              
              <!-- Expense bars -->
              <g>
                <rect *ngFor="let bar of expenseBars" 
                  [attr.x]="bar.x" 
                  [attr.y]="bar.y" 
                  [attr.width]="bar.width" 
                  [attr.height]="bar.height"
                  class="expense-bar"
                  rx="2"
                >
                </rect>
              </g>
              
              <!-- Balance line -->
              <g>
                <polyline
                  [attr.points]="balanceLine"
                  class="balance-line"
                ></polyline>
                
                <circle *ngFor="let point of balancePoints"
                  [attr.cx]="point.x"
                  [attr.cy]="point.y"
                  r="3"
                  class="balance-point"
                ></circle>
              </g>
            </svg>
            
            <div class="x-axis">
              <div *ngFor="let label of xAxisLabels" class="x-label">
                {{ label }}
              </div>
            </div>
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
      flex-direction: column;
      height: 240px;
    }
    
    .chart-legend {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-md);
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-right: var(--spacing-lg);
    }
    
    .color-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-right: var(--spacing-sm);
    }
    
    .color-box.income {
      background-color: var(--success);
    }
    
    .color-box.expenses {
      background-color: var(--danger);
    }
    
    .color-box.balance {
      background-color: var(--primary);
    }
    
    .legend-label {
      font-size: 0.875rem;
    }
    
    .chart-area {
      display: flex;
      flex: 1;
    }
    
    .y-axis {
      width: 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 20px;
    }
    
    .y-tick {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: right;
      padding-right: var(--spacing-sm);
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    
    .chart {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .income-bar {
      fill: var(--success);
      opacity: 0.7;
    }
    
    .expense-bar {
      fill: var(--danger);
      opacity: 0.7;
    }
    
    .balance-line {
      fill: none;
      stroke: var(--primary);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    .balance-point {
      fill: var(--primary);
    }
    
    .x-axis {
      height: 20px;
      display: flex;
      justify-content: space-around;
    }
    
    .x-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
    }
  `]
})
export class BalanceTrendComponent implements OnChanges {
  @Input() transactions: Transaction[] = [];
  
  periods = [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: 'YTD', value: 'ytd' },
    { label: '1Y', value: '1y' }
  ];
  
  selectedPeriod = '3m';
  
  // Chart data
  incomeBars: { x: number, y: number, width: number, height: number }[] = [];
  expenseBars: { x: number, y: number, width: number, height: number }[] = [];
  balanceLine = '';
  balancePoints: { x: number, y: number }[] = [];
  xAxisLabels: string[] = [];
  yAxisTicks: number[] = [];
  
  // Chart dimensions
  chartWidth = 0;
  chartHeight = 200;
  barWidth = 0;
  barGap = 0;
  
  ngOnChanges(): void {
    this.generateChartData();
  }
  
  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.generateChartData();
  }
  
  private generateChartData(): void {
    // Determine date range based on selected period
    const now = new Date();
    let startDate = new Date();
    let groupBy: 'day' | 'week' | 'month' = 'day';
    let format = 'MMM d';
    
    switch (this.selectedPeriod) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        groupBy = 'day';
        this.xAxisLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        groupBy = 'week';
        this.xAxisLabels = ['Month 1', 'Month 2', 'Month 3'];
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        groupBy = 'month';
        this.xAxisLabels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        this.xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, now.getMonth() + 1);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        groupBy = 'month';
        this.xAxisLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }
    
    // For demo purposes, we'll generate random data
    // In a real app, you would filter transactions by date and group them
    
    const numBars = this.xAxisLabels.length;
    const maxValue = 2000; // For demo
    
    // Calculate chart dimensions
    this.chartWidth = 0; // Will be set by the width of the container at runtime
    this.barWidth = Math.floor((this.chartWidth - (numBars + 1) * 10) / numBars);
    this.barGap = 10;
    
    // Generate Y-axis ticks
    this.yAxisTicks = [0, maxValue / 4, maxValue / 2, (3 * maxValue) / 4, maxValue];
    
    // Generate random data for demo
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const balanceData: number[] = [];
    
    for (let i = 0; i < numBars; i++) {
      const income = Math.floor(Math.random() * (maxValue - 500)) + 500;
      const expense = Math.floor(Math.random() * income);
      
      incomeData.push(income);
      expenseData.push(expense);
      balanceData.push(income - expense);
    }
    
    // Generate bar and line data
    this.incomeBars = [];
    this.expenseBars = [];
    this.balancePoints = [];
    
    const barGap = 10;
    const barWidth = 20;
    
    for (let i = 0; i < numBars; i++) {
      const x = i * (barWidth * 2 + barGap) + 10;
      
      // Income bar
      const incomeHeight = (incomeData[i] / maxValue) * (this.chartHeight - 20);
      this.incomeBars.push({
        x,
        y: this.chartHeight - incomeHeight,
        width: barWidth,
        height: incomeHeight
      });
      
      // Expense bar
      const expenseHeight = (expenseData[i] / maxValue) * (this.chartHeight - 20);
      this.expenseBars.push({
        x: x + barWidth,
        y: this.chartHeight - expenseHeight,
        width: barWidth,
        height: expenseHeight
      });
      
      // Balance point
      const balanceY = this.chartHeight - (balanceData[i] / maxValue) * (this.chartHeight - 20);
      this.balancePoints.push({
        x: x + barWidth,
        y: balanceY
      });
    }
    
    // Generate balance line
    this.balanceLine = this.balancePoints.map(point => `${point.x},${point.y}`).join(' ');
  }
}