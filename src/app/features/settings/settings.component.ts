import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
        <p class="subtitle">Manage your account preferences and settings</p>
      </div>

      <div class="settings-content">
        <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()" class="settings-form">
          <div class="settings-section">
            <h2>Account Settings</h2>
            
            <div class="form-group">
              <label for="displayName">Display Name</label>
              <input 
                type="text" 
                id="displayName" 
                formControlName="displayName" 
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                class="form-control"
                [disabled]="true"
              >
            </div>
          </div>

          <div class="settings-section">
            <h2>Preferences</h2>
            
            <div class="form-group">
              <label for="currency">Default Currency</label>
              <select id="currency" formControlName="currency" class="form-control">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="language">Language</label>
              <select id="language" formControlName="language" class="form-control">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="theme">Theme</label>
              <select id="theme" formControlName="theme" class="form-control">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="defaultView">Default View</label>
              <select id="defaultView" formControlName="defaultView" class="form-control">
                <option value="dashboard">Dashboard</option>
                <option value="transactions">Transactions</option>
                <option value="budgets">Budgets</option>
              </select>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="notifications">
                <span>Enable Notifications</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <h2>Security</h2>
            
            <button type="button" class="btn btn-secondary" (click)="changePassword()">
              Change Password
            </button>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="resetForm()">
              Reset Changes
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!settingsForm.dirty">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .settings-header {
      margin-bottom: var(--spacing-xl);
    }

    .settings-header h1 {
      margin-bottom: var(--spacing-xs);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: var(--font-size-lg);
    }

    .settings-content {
      background-color: var(--background);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--box-shadow);
    }

    .settings-form {
      padding: var(--spacing-lg);
    }

    .settings-section {
      margin-bottom: var(--spacing-xl);
    }

    .settings-section h2 {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .checkbox-group {
      margin-top: var(--spacing-md);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      margin-right: var(--spacing-sm);
    }

    .form-control:disabled {
      background-color: var(--neutral-light);
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--neutral);
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: var(--spacing-md);
      }

      .settings-form {
        padding: var(--spacing-md);
      }

      .form-actions {
        flex-direction: column-reverse;
        gap: var(--spacing-sm);
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.settingsForm = this.formBuilder.group({
      displayName: [''],
      email: [''],
      currency: ['USD'],
      language: ['en'],
      theme: ['light'],
      defaultView: ['dashboard'],
      notifications: [true]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.settingsForm.patchValue({
          displayName: user.displayName,
          email: user.email,
          ...user.settings
        });
      }
    });
  }

  saveSettings(): void {
    if (this.settingsForm.valid && this.settingsForm.dirty) {
      const formValues = this.settingsForm.value;
      // In a real app, this would make an API call to update user settings
      console.log('Saving settings:', formValues);
      this.settingsForm.markAsPristine();
    }
  }

  resetForm(): void {
    if (this.currentUser) {
      this.settingsForm.patchValue({
        displayName: this.currentUser.displayName,
        email: this.currentUser.email,
        ...this.currentUser.settings
      });
    }
  }

  changePassword(): void {
    // In a real app, this would open a modal or navigate to password change page
    console.log('Change password clicked');
  }
}