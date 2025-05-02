export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface GoalProgress {
  percentage: number;
  remainingAmount: number;
  daysLeft: number;
  monthlyContributionNeeded: number;
  isAchievable: boolean;
}