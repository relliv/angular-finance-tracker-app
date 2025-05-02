import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="goals-container">
      <h1>Financial Goals</h1>
      <p>This component will display and manage financial goals.</p>
    </div>
  `,
  styles: [`
    .goals-container {
      padding: var(--spacing-md);
    }
  `]
})
export class GoalsComponent {}