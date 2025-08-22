export interface Todo {
  id: number;
  userId: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  reminder?: Date;
}