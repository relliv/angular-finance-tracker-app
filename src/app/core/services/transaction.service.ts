import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Transaction, TransactionCategory, DEFAULT_CATEGORIES } from '../../models/transaction.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [];
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  
  public transactions$ = this.transactionsSubject.asObservable();
  public categories: TransactionCategory[] = DEFAULT_CATEGORIES;

  constructor(private authService: AuthService) {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Get current user ID
    const userId = this.authService.currentUser?.id || '1';

    // Mock transactions data
    const today = new Date();
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId,
        amount: 1200,
        type: 'income',
        category: 'income',
        subcategory: 'Salary',
        date: new Date(today.getFullYear(), today.getMonth(), 1),
        description: 'Monthly Salary',
        isRecurring: true,
        recurringDetails: {
          frequency: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth() - 6, 1)
        }
      },
      {
        id: '2',
        userId,
        amount: 800,
        type: 'expense',
        category: 'housing',
        subcategory: 'Rent',
        date: new Date(today.getFullYear(), today.getMonth(), 5),
        description: 'Monthly Rent',
        isRecurring: true,
        recurringDetails: {
          frequency: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth() - 6, 5)
        }
      },
      {
        id: '3',
        userId,
        amount: 120,
        type: 'expense',
        category: 'food',
        subcategory: 'Groceries',
        date: new Date(today.getFullYear(), today.getMonth(), 10),
        description: 'Weekly Groceries',
        isRecurring: false,
        tags: ['essentials']
      },
      {
        id: '4',
        userId,
        amount: 50,
        type: 'expense',
        category: 'entertainment',
        subcategory: 'Movies',
        date: new Date(today.getFullYear(), today.getMonth(), 15),
        description: 'Movie Night',
        isRecurring: false
      },
      {
        id: '5',
        userId,
        amount: 200,
        type: 'expense',
        category: 'transportation',
        subcategory: 'Gas',
        date: new Date(today.getFullYear(), today.getMonth(), 20),
        description: 'Fuel for Car',
        isRecurring: false
      }
    ];

    this.transactions = mockTransactions;
    this.transactionsSubject.next(this.transactions);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$;
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    return this.transactions$.pipe(
      map(transactions => transactions.find(transaction => transaction.id === id))
    );
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => 
        transactions.filter(transaction => 
          transaction.date >= startDate && transaction.date <= endDate
        )
      )
    );
  }

  getTransactionsByCategory(categoryId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => 
        transactions.filter(transaction => transaction.category === categoryId)
      )
    );
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId()
    };

    this.transactions.push(newTransaction);
    this.transactionsSubject.next([...this.transactions]);

    return of(newTransaction).pipe(delay(300));
  }

  updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    const index = this.transactions.findIndex(t => t.id === id);
    
    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        ...transaction
      };
      
      this.transactionsSubject.next([...this.transactions]);
      return of(this.transactions[index]).pipe(delay(300));
    }
    
    throw new Error('Transaction not found');
  }

  deleteTransaction(id: string): Observable<boolean> {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== id);
    
    if (initialLength !== this.transactions.length) {
      this.transactionsSubject.next([...this.transactions]);
      return of(true).pipe(delay(300));
    }
    
    return of(false).pipe(delay(300));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getCategories(): Observable<TransactionCategory[]> {
    return of(this.categories);
  }

  getCategoryById(id: string): Observable<TransactionCategory | undefined> {
    return of(this.categories.find(category => category.id === id));
  }
}