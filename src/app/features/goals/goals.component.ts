import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../core/services/goal.service';
import { FinancialGoal } from '../../models/goal.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="goals-container">
      <div class="goals-header">
        <div class="header-content">
          <h1>Financial Goals</h1>
          <p class="subtitle">Set and track your financial objectives</p>
        </div>
        <button class="btn btn-primary" (click)="showAddGoal = true">
          <span class="material-symbols-outlined">add</span>
          Add Goal
        </button>
      </div>

      <!-- Add Goal Modal -->
      <div class="modal" *ngIf="showAddGoal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Create New Goal</h2>
            <button class="close-btn" (click)="showAddGoal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form [formGroup]="goalForm" (ngSubmit)="createGoal()" class="goal-form">
            <div class="form-group">
              <label for="name">Goal Name</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                placeholder="e.g., Emergency Fund"
              >
            </div>

            <div class="form-group">
              <label for="targetAmount">Target Amount</label>
              <div class="amount-input">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  id="targetAmount" 
                  formControlName="targetAmount" 
                  class="form-control"
                  placeholder="0.00"
                  step="0.01"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="currentAmount">Current Amount</label>
              <div class="amount-input">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  id="currentAmount" 
                  formControlName="currentAmount" 
                  class="form-control"
                  placeholder="0.00"
                  step="0.01"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="targetDate">Target Date</label>
              <input 
                type="date" 
                id="targetDate" 
                formControlName="targetDate" 
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="debt">Debt Repayment</option>
                <option value="purchase">Major Purchase</option>
                <option value="travel">Travel</option>
                <option value="education">Education</option>
                <option value="retirement">Retirement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" formControlName="priority" class="form-control">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="showAddGoal = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!goalForm.valid">
                Create Goal
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Goals Grid -->
      <div class="goals-grid">
        <div *ngFor="let goal of goals" class="goal-card">
          <div class="goal-header">
            <div class="goal-priority" [class]="goal.priority"></div>
            <div class="goal-actions">
              <button class="action-btn" (click)="editGoal(goal)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="action-btn delete" (click)="deleteGoal(goal)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

          <h3 class="goal-name">{{ goal.name }}</h3>
          <div class="goal-category">{{ goal.category | titlecase }}</div>

          <div class="goal-progress">
            <div class="progress-stats">
              <div class="current-amount">{{ goal.currentAmount | currency }}</div>
              <div class="target-amount">of {{ goal.targetAmount | currency }}</div>
            </div>
            
            <div class="progress-bar">
              <div 
                class="progress-value" 
                [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"
              ></div>
            </div>
            
            <div class="progress-percentage">
              {{ (goal.currentAmount / goal.targetAmount) * 100 | number:'1.0-0' }}% Complete
            </div>
          </div>

          <div class="goal-footer">
            <div class="time-remaining">
              <span class="material-symbols-outlined">schedule</span>
              {{ getDaysLeft(goal) }} days left
            </div>
            <div class="target-date">
              Target: {{ goal.targetDate | date:'MMM d, y' }}
            </div>
          </div>

          <div class="contribution-needed" *ngIf="getMonthlyContribution(goal) as contribution">
            <div class="label">Monthly contribution needed:</div>
            <div class="amount">{{ contribution | currency }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .goals-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .goals-header {
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
    .goal-form {
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

    /* Goals Grid */
    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .goal-card {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--box-shadow);
      position: relative;
      transition: transform 0.2s ease;
    }

    .goal-card:hover {
      transform: translateY(-2px);
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }

    .goal-priority {
      width: 4px;
      height: 24px;
      border-radius: 2px;
    }

    .goal-priority.high {
      background-color: var(--danger);
    }

    .goal-priority.medium {
      background-color: var(--warning);
    }

    .goal-priority.low {
      background-color: var(--success);
    }

    .goal-actions {
      display: flex;
      gap: var(--spacing-sm);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .goal-card:hover .goal-actions {
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
      background-color: var(--neutral-light);
    }

    .action-btn.delete:hover {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }

    .goal-name {
      margin: 0 0 var(--spacing-xs);
      font-size: var(--font-size-xl);
    }

    .goal-category {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-lg);
    }

    .goal-progress {
      margin-bottom: var(--spacing-lg);
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
    }

    .current-amount {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .target-amount {
      color: var(--text-secondary);
    }

    .progress-bar {
      height: 8px;
      background-color: var(--neutral-light);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: var(--spacing-xs);
    }

    .progress-value {
      height: 100%;
      background-color: var(--primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-percentage {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-align: right;
    }

    .goal-footer {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-md);
    }

    .time-remaining {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .contribution-needed {
      background-color: var(--neutral-light);
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
    }

    .contribution-needed .label {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-xs);
    }

    .contribution-needed .amount {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
    }

    @media (max-width: 768px) {
      .goals-container {
        padding: var(--spacing-md);
      }

      .goals-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .goal-actions {
        opacity: 1;
      }
    }
  `]
})
export class GoalsComponent implements OnInit {
  showAddGoal = false;
  goalForm: FormGroup;
  goals: FinancialGoal[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private goalService: GoalService
  ) {
    this.goalForm = this.formBuilder.group({
      name: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(0.01)]],
      currentAmount: ['', [Validators.required, Validators.min(0)]],
      targetDate: ['', Validators.required],
      category: ['savings', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe(goals => {
      this.goals = goals;
    });
  }

  createGoal(): void {
    if (this.goalForm.valid) {
      const newGoal = {
        ...this.goalForm.value,
        startDate: new Date(),
        targetDate: new Date(this.goalForm.value.targetDate)
      };

      this.goalService.addGoal(newGoal).subscribe(() => {
        this.showAddGoal = false;
        this.goalForm.reset({
          category: 'savings',
          priority: 'medium'
        });
        this.loadGoals();
      });
    }
  }

  editGoal(goal: FinancialGoal): void {
    // Implement edit functionality
    console.log('Edit goal:', goal);
  }

  deleteGoal(goal: FinancialGoal): void {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalService.deleteGoal(goal.id).subscribe(() => {
        this.loadGoals();
      });
    }
  }

  getDaysLeft(goal: FinancialGoal): number {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }

  getMonthlyContribution(goal: FinancialGoal): number {
    const daysLeft = this.getDaysLeft(goal);
    if (daysLeft === 0) return 0;
    
    const monthsLeft = daysLeft / 30;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    return remainingAmount / monthsLeft;
  }
}