import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <h1>Reports & Analytics</h1>
      <p>This component will display financial reports and analytics.</p>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: var(--spacing-md);
    }
  `]
})
export class ReportsComponent {}