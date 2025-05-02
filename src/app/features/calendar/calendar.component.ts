import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <h1>Financial Calendar</h1>
      <p>This component will display a calendar view of financial events.</p>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: var(--spacing-md);
    }
  `]
})
export class CalendarComponent {}