type TodoStatus = 'completed' | 'active';

export interface Todo {
  id: string;
  description: string;
  createdAt: string;
  status: TodoStatus;
}
