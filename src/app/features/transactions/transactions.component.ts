import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <h1>Transactions</h1>
      <p>This component will display and manage all transactions.</p>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: var(--spacing-md);
    }
  `]
})
export class TransactionsComponent {}