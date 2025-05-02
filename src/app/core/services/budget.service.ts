import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Budget, BudgetSummary } from '../../models/budget.model';
import { TransactionService } from './transaction.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgets: Budget[] = [];
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  
  public budgets$ = this.budgetsSubject.asObservable();

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Get current user ID
    const userId = this.authService.currentUser?.id || '1';

    // Current month data
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Mock budget data
    const mockBudgets: Budget[] = [
      {
        id: '1',
        userId,
        name: 'Monthly Budget',
        amount: 2000,
        period: 'monthly',
        startDate: startOfMonth,
        endDate: endOfMonth,
        categories: [
          {
            categoryId: 'housing',
            amount: 800,
            spent: 800,
            subcategories: [
              { name: 'Rent', amount: 800, spent: 800 }
            ]
          },
          {
            categoryId: 'food',
            amount: 400,
            spent: 120,
            subcategories: [
              { name: 'Groceries', amount: 300, spent: 120 },
              { name: 'Restaurants', amount: 100, spent: 0 }
            ]
          },
          {
            categoryId: 'transportation',
            amount: 200,
            spent: 200,
            subcategories: [
              { name: 'Gas', amount: 150, spent: 200 },
              { name: 'Public Transit', amount: 50, spent: 0 }
            ]
          },
          {
            categoryId: 'entertainment',
            amount: 100,
            spent: 50,
            subcategories: [
              { name: 'Movies', amount: 50, spent: 50 },
              { name: 'Other', amount: 50, spent: 0 }
            ]
          },
          {
            categoryId: 'other',
            amount: 500,
            spent: 0
          }
        ]
      }
    ];

    this.budgets = mockBudgets;
    this.budgetsSubject.next(this.budgets);
  }

  getBudgets(): Observable<Budget[]> {
    return this.budgets$;
  }

  getCurrentBudget(): Observable<Budget | undefined> {
    const today = new Date();
    
    return this.budgets$.pipe(
      map(budgets => budgets.find(budget => 
        budget.startDate <= today && 
        (!budget.endDate || budget.endDate >= today)
      ))
    );
  }

  getBudgetById(id: string): Observable<Budget | undefined> {
    return this.budgets$.pipe(
      map(budgets => budgets.find(budget => budget.id === id))
    );
  }

  addBudget(budget: Omit<Budget, 'id'>): Observable<Budget> {
    const newBudget: Budget = {
      ...budget,
      id: this.generateId()
    };

    this.budgets.push(newBudget);
    this.budgetsSubject.next([...this.budgets]);

    return of(newBudget).pipe(delay(300));
  }

  updateBudget(id: string, budget: Partial<Budget>): Observable<Budget> {
    const index = this.budgets.findIndex(b => b.id === id);
    
    if (index !== -1) {
      this.budgets[index] = {
        ...this.budgets[index],
        ...budget
      };
      
      this.budgetsSubject.next([...this.budgets]);
      return of(this.budgets[index]).pipe(delay(300));
    }
    
    throw new Error('Budget not found');
  }

  deleteBudget(id: string): Observable<boolean> {
    const initialLength = this.budgets.length;
    this.budgets = this.budgets.filter(b => b.id !== id);
    
    if (initialLength !== this.budgets.length) {
      this.budgetsSubject.next([...this.budgets]);
      return of(true).pipe(delay(300));
    }
    
    return of(false).pipe(delay(300));
  }

  getBudgetSummary(budgetId: string): Observable<BudgetSummary> {
    return this.getBudgetById(budgetId).pipe(
      map(budget => {
        if (!budget) throw new Error('Budget not found');

        const categories = budget.categories;
        const totalBudget = budget.amount;
        const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
        const spentPercentage = (totalSpent / totalBudget) * 100;

        const categorySummaries = categories.map(cat => {
          const category = this.transactionService.categories.find(c => c.id === cat.categoryId);
          return {
            categoryId: cat.categoryId,
            name: category?.name || 'Unknown',
            budgeted: cat.amount,
            spent: cat.spent,
            percentage: (cat.spent / cat.amount) * 100,
            color: category?.color || '#9e9e9e'
          };
        });

        return {
          totalBudget,
          totalSpent,
          spentPercentage,
          categorySummaries
        };
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}