import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FinancialGoal, GoalProgress } from '../../models/goal.model';
import { AuthService } from '../auth/auth.service';
import { differenceInDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goals: FinancialGoal[] = [];
  private goalsSubject = new BehaviorSubject<FinancialGoal[]>([]);
  
  public goals$ = this.goalsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Get current user ID
    const userId = this.authService.currentUser?.id || '1';

    // Date calculations
    const today = new Date();
    const threeMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    // Mock goals data
    const mockGoals: FinancialGoal[] = [
      {
        id: '1',
        userId,
        name: 'Emergency Fund',
        targetAmount: 5000,
        currentAmount: 2500,
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        targetDate: sixMonthsFromNow,
        category: 'savings',
        priority: 'high'
      },
      {
        id: '2',
        userId,
        name: 'Vacation',
        targetAmount: 2000,
        currentAmount: 500,
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        targetDate: threeMonthsFromNow,
        category: 'travel',
        priority: 'medium'
      },
      {
        id: '3',
        userId,
        name: 'New Laptop',
        targetAmount: 1500,
        currentAmount: 300,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        targetDate: oneYearFromNow,
        category: 'electronics',
        priority: 'low'
      }
    ];

    this.goals = mockGoals;
    this.goalsSubject.next(this.goals);
  }

  getGoals(): Observable<FinancialGoal[]> {
    return this.goals$;
  }

  getGoalById(id: string): Observable<FinancialGoal | undefined> {
    return this.goals$.pipe(
      map(goals => goals.find(goal => goal.id === id))
    );
  }

  addGoal(goal: Omit<FinancialGoal, 'id'>): Observable<FinancialGoal> {
    const newGoal: FinancialGoal = {
      ...goal,
      id: this.generateId()
    };

    this.goals.push(newGoal);
    this.goalsSubject.next([...this.goals]);

    return of(newGoal).pipe(delay(300));
  }

  updateGoal(id: string, goal: Partial<FinancialGoal>): Observable<FinancialGoal> {
    const index = this.goals.findIndex(g => g.id === id);
    
    if (index !== -1) {
      this.goals[index] = {
        ...this.goals[index],
        ...goal
      };
      
      this.goalsSubject.next([...this.goals]);
      return of(this.goals[index]).pipe(delay(300));
    }
    
    throw new Error('Goal not found');
  }

  deleteGoal(id: string): Observable<boolean> {
    const initialLength = this.goals.length;
    this.goals = this.goals.filter(g => g.id !== id);
    
    if (initialLength !== this.goals.length) {
      this.goalsSubject.next([...this.goals]);
      return of(true).pipe(delay(300));
    }
    
    return of(false).pipe(delay(300));
  }

  getGoalProgress(goalId: string): Observable<GoalProgress> {
    return this.getGoalById(goalId).pipe(
      map(goal => {
        if (!goal) throw new Error('Goal not found');

        const today = new Date();
        const daysLeft = differenceInDays(goal.targetDate, today);
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        
        // Calculate how much needs to be saved monthly to reach the goal
        const monthsLeft = daysLeft / 30; // Approximate
        const monthlyContributionNeeded = remainingAmount / monthsLeft;
        
        // Determine if goal is achievable (arbitrary logic for demo)
        const isAchievable = monthlyContributionNeeded <= 500; // Assuming $500 is max monthly savings
        
        return {
          percentage,
          remainingAmount,
          daysLeft,
          monthlyContributionNeeded,
          isAchievable
        };
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}