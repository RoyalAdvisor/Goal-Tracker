type TodoStatus = 'completed' | 'active';
export type TodoFilterFlag = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  description: string;
  createdAt: string;
  status: TodoStatus;
}

export interface TodoResponse {
  todos: Todo[];
  flag: TodoFilterFlag;
}
