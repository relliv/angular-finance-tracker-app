import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { BudgetService } from '../../core/services/budget.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="header-content">
          <h1>Financial Calendar</h1>
          <p class="subtitle">View and manage your financial schedule</p>
        </div>
        
        <div class="calendar-controls">
          <button class="btn btn-outline" (click)="previousMonth()">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          
          <div class="current-month">
            {{ currentDate | date:'MMMM yyyy' }}
          </div>
          
          <button class="btn btn-outline" (click)="nextMonth()">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
          
          <button class="btn btn-outline" (click)="goToToday()">Today</button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- Weekday Headers -->
        <div class="weekday-header" *ngFor="let day of weekDays">
          {{ day }}
        </div>

        <!-- Calendar Days -->
        <div 
          *ngFor="let day of calendarDays" 
          class="calendar-day"
          [class.today]="isToday(day.date)"
          [class.current-month]="isSameMonth(day.date)"
          [class.has-events]="day.events.length > 0"
        >
          <div class="day-header">
            <span class="day-number">{{ day.date | date:'d' }}</span>
            <button 
              *ngIf="isSameMonth(day.date)"
              class="add-event-btn" 
              (click)="addEvent(day.date)"
            >
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>

          <div class="day-events">
            <div 
              *ngFor="let event of day.events" 
              class="event-item"
              [class]="event.type"
              (click)="viewEvent(event)"
            >
              <span class="event-amount">{{ event.amount | currency }}</span>
              <span class="event-title">{{ event.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Event Modal -->
      <div class="modal" *ngIf="showAddEvent">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Add Financial Event</h2>
            <button class="close-btn" (click)="showAddEvent = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form [formGroup]="eventForm" (ngSubmit)="createEvent()" class="event-form">
            <div class="form-group">
              <label for="type">Type</label>
              <select id="type" formControlName="type" class="form-control">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="bill">Bill</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <input 
                type="text" 
                id="description" 
                formControlName="description" 
                class="form-control"
                placeholder="Enter description"
              >
            </div>

            <div class="form-group">
              <label for="amount">Amount</label>
              <div class="amount-input">
                <span class="currency">$</span>
                <input 
                  type="number" 
                  id="amount" 
                  formControlName="amount" 
                  class="form-control"
                  placeholder="0.00"
                  step="0.01"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="">Select category</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isRecurring">
                <span>Recurring Event</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="showAddEvent = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!eventForm.valid">
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .calendar-header {
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

    .calendar-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .current-month {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-medium);
      padding: 0 var(--spacing-lg);
    }

    /* Calendar Grid */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background-color: var(--neutral);
      border: 1px solid var(--neutral);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    .weekday-header {
      background-color: var(--primary);
      color: white;
      padding: var(--spacing-md);
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .calendar-day {
      background-color: var(--background);
      min-height: 120px;
      padding: var(--spacing-sm);
      position: relative;
    }

    .calendar-day:not(.current-month) {
      background-color: var(--neutral-light);
      color: var(--text-secondary);
    }

    .calendar-day.today {
      background-color: rgba(63, 81, 181, 0.05);
    }

    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }

    .day-number {
      font-weight: var(--font-weight-medium);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .today .day-number {
      background-color: var(--primary);
      color: white;
    }

    .add-event-btn {
      opacity: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
      padding: var(--spacing-xs);
      border-radius: var(--border-radius-sm);
      transition: all 0.2s ease;
    }

    .calendar-day:hover .add-event-btn {
      opacity: 1;
    }

    .add-event-btn:hover {
      background-color: var(--neutral-light);
      color: var(--primary);
    }

    .day-events {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .event-item {
      font-size: var(--font-size-xs);
      padding: 4px var(--spacing-xs);
      border-radius: 2px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: transform 0.2s ease;
    }

    .event-item:hover {
      transform: translateX(2px);
    }

    .event-item.income {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success);
    }

    .event-item.expense {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--danger);
    }

    .event-item.bill {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning);
    }

    .event-item.reminder {
      background-color: rgba(63, 81, 181, 0.1);
      color: var(--primary);
    }

    .event-amount {
      font-weight: var(--font-weight-medium);
      margin-right: var(--spacing-xs);
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
    .event-form {
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

    @media (max-width: 992px) {
      .calendar-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .calendar-controls {
        width: 100%;
        justify-content: space-between;
      }
    }

    @media (max-width: 768px) {
      .calendar-container {
        padding: var(--spacing-md);
      }

      .weekday-header {
        padding: var(--spacing-sm);
        font-size: var(--font-size-sm);
      }

      .calendar-day {
        min-height: 100px;
      }

      .add-event-btn {
        opacity: 1;
      }

      .event-item {
        padding: 2px var(--spacing-xs);
      }
    }

    @media (max-width: 480px) {
      .calendar-grid {
        font-size: var(--font-size-xs);
      }

      .calendar-day {
        min-height: 80px;
        padding: 4px;
      }

      .event-item {
        font-size: 10px;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Array<{
    date: Date;
    events: Array<{
      type: string;
      description: string;
      amount: number;
      category?: string;
    }>;
  }> = [];
  
  showAddEvent = false;
  selectedDate: Date | null = null;
  eventForm: FormGroup;
  categories: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private budgetService: BudgetService
  ) {
    this.eventForm = this.formBuilder.group({
      type: ['expense'],
      description: [''],
      amount: [''],
      category: [''],
      isRecurring: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.generateCalendar();
    this.loadEvents();
  }

  loadCategories(): void {
    this.transactionService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    // Get the first day to display (including days from previous month)
    const firstDayToShow = new Date(firstDay);
    firstDayToShow.setDate(firstDayToShow.getDate() - firstDay.getDay());
    
    // Get the last day to display (including days from next month)
    const lastDayToShow = new Date(lastDay);
    lastDayToShow.setDate(lastDayToShow.getDate() + (6 - lastDay.getDay()));
    
    this.calendarDays = [];
    let currentDay = new Date(firstDayToShow);
    
    while (currentDay <= lastDayToShow) {
      this.calendarDays.push({
        date: new Date(currentDay),
        events: []
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
  }

  loadEvents(): void {
    // In a real app, this would load events from a service
    // For demo purposes, we'll add some sample events
    const sampleEvents = [
      {
        date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 15),
        type: 'income',
        description: 'Salary',
        amount: 3000
      },
      {
        date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
        type: 'expense',
        description: 'Rent',
        amount: 1200
      },
      {
        date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 5),
        type: 'bill',
        description: 'Utilities',
        amount: 150
      }
    ];

    sampleEvents.forEach(event => {
      const dayIndex = this.calendarDays.findIndex(day => 
        day.date.getDate() === event.date.getDate() &&
        day.date.getMonth() === event.date.getMonth()
      );
      
      if (dayIndex !== -1) {
        this.calendarDays[dayIndex].events.push(event);
      }
    });
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
    this.loadEvents();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
    this.loadEvents();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
    this.loadEvents();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  addEvent(date: Date): void {
    this.selectedDate = date;
    this.showAddEvent = true;
  }

  createEvent(): void {
    if (this.eventForm.valid && this.selectedDate) {
      const formValues = this.eventForm.value;
      
      // In a real app, this would create an event through a service
      console.log('Creating event:', {
        ...formValues,
        date: this.selectedDate
      });
      
      this.showAddEvent = false;
      this.selectedDate = null;
      this.eventForm.reset({
        type: 'expense',
        isRecurring: false
      });
    }
  }

  viewEvent(event: any): void {
    // In a real app, this would show event details
    console.log('View event:', event);
  }
}