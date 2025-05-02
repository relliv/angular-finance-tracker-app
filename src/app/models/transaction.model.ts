export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  date: Date;
  description: string;
  tags?: string[];
  attachments?: string[];
  isRecurring: boolean;
  recurringDetails?: RecurringDetails;
}

export interface RecurringDetails {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export const DEFAULT_CATEGORIES: TransactionCategory[] = [
  { id: 'housing', name: 'Housing', icon: 'home', color: '#4caf50', subcategories: ['Rent', 'Mortgage', 'Utilities', 'Maintenance'] },
  { id: 'transportation', name: 'Transportation', icon: 'directions_car', color: '#2196f3', subcategories: ['Gas', 'Public Transit', 'Car Maintenance'] },
  { id: 'food', name: 'Food', icon: 'restaurant', color: '#ff9800', subcategories: ['Groceries', 'Restaurants', 'Takeout'] },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie', color: '#e91e63', subcategories: ['Movies', 'Games', 'Events'] },
  { id: 'shopping', name: 'Shopping', icon: 'shopping_bag', color: '#9c27b0', subcategories: ['Clothing', 'Electronics', 'Gifts'] },
  { id: 'health', name: 'Health', icon: 'local_hospital', color: '#f44336', subcategories: ['Doctor', 'Pharmacy', 'Fitness'] },
  { id: 'education', name: 'Education', icon: 'school', color: '#795548', subcategories: ['Tuition', 'Books', 'Courses'] },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#607d8b', subcategories: ['Grooming', 'Subscriptions'] },
  { id: 'income', name: 'Income', icon: 'account_balance', color: '#4caf50', subcategories: ['Salary', 'Freelance', 'Investments', 'Gifts'] },
  { id: 'other', name: 'Other', icon: 'more_horiz', color: '#9e9e9e', subcategories: [] }
];