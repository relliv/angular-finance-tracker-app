export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  defaultView: 'dashboard' | 'transactions' | 'budgets';
}