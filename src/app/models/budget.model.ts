export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: Date;
  endDate?: Date;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  categoryId: string;
  amount: number;
  spent: number;
  subcategories?: BudgetSubcategory[];
}

export interface BudgetSubcategory {
  name: string;
  amount: number;
  spent: number;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  spentPercentage: number;
  categorySummaries: {
    categoryId: string;
    name: string;
    budgeted: number;
    spent: number;
    percentage: number;
    color: string;
  }[];
}