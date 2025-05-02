import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinancialGoal } from '../../../../models/goal.model';
import { GoalService } from '../../../../core/services/goal.service';

@Component({
  selector: 'app-goal-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="component-container">
      <div class="component-header">
        <h2>Financial Goals</h2>
        <a routerLink="/goals" class="view-all">View All</a>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading goals...</p>
      </div>
      
      <ng-container *ngIf="!loading">
        <div *ngIf="goals && goals.length > 0; else noGoals" class="goals-list">
          <div *ngFor="let goal of goals" class="goal-item">
            <div class="goal-priority" [ngClass]="goal.priority"></div>
            <div class="goal-details">
              <div class="goal-name">{{ goal.name }}</div>
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-value" [style.width.%]="getProgressPercentage(goal)"></div>
                </div>
                <div class="progress-stats">
                  <span>{{ getProgressPercentage(goal) | number: '1.0-0' }}%</span>
                  <span>{{ goal.currentAmount | currency }} of {{ goal.targetAmount | currency }}</span>
                </div>
              </div>
              <div class="goal-dates">
                <span class="target-date">Target: {{ goal.targetDate | date: 'MMM d, y' }}</span>
                <span class="days-left">{{ getDaysLeft(goal) }} days left</span>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #noGoals>
          <div class="empty-state">
            <span class="material-symbols-outlined">flag</span>
            <h3>No Financial Goals</h3>
            <p>You haven't set any financial goals yet.</p>
            <a routerLink="/goals/create" class="btn btn-primary">Create Goal</a>
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
    
    .goals-list {
      flex: 1;
      overflow-y: auto;
    }
    
    .goal-item {
      display: flex;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--neutral-light);
    }
    
    .goal-item:last-child {
      border-bottom: none;
    }
    
    .goal-priority {
      width: 4px;
      border-radius: 2px;
      margin-right: var(--spacing-md);
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
    
    .goal-details {
      flex: 1;
    }
    
    .goal-name {
      font-weight: 500;
      margin-bottom: var(--spacing-sm);
    }
    
    .goal-progress {
      margin-bottom: var(--spacing-sm);
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
    
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .goal-dates {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-xl) 0;
      flex: 1;
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
export class GoalProgressComponent {
  @Input() goals: FinancialGoal[] = [];
  @Input() loading = false;
  
  getProgressPercentage(goal: FinancialGoal): number {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }
  
  getDaysLeft(goal: FinancialGoal): number {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }
}