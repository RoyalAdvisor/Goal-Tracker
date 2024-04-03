type TodoStatus = 'completed' | 'active';
export type TodoFilterFlag = 'all' | 'active' | 'completed';
export type TodoFilterFlagCounts = {
  flag: TodoFilterFlag;
  count: number;
};

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
