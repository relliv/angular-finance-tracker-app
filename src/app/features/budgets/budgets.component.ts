import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budgets-container">
      <h1>Budgets</h1>
      <p>This component will display and manage budgets.</p>
    </div>
  `,
  styles: [`
    .budgets-container {
      padding: var(--spacing-md);
    }
  `]
})
export class BudgetsComponent {}