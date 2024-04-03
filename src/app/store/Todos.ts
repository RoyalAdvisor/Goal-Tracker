import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TodoFilterFlag, TodoResponse, Todo } from '../models/Todo';
import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { tap } from 'rxjs';

export namespace Todos {
  export class GetAllTodos {
    static readonly type = '[TodoResponse] Get';
    constructor(public flag: TodoFilterFlag) {}
  }
  export class AddTodo {
    static readonly type = '[Todo] Add';
    constructor(public todo: Todo) {}
  }
  export class RemoveTodoById {
    static readonly type = '[Todo] Remove';
    constructor(public id: string) {}
  }
  export class UpdateTodo {
    static readonly type = '[Todo] Update';
    constructor(public todo: Todo) {}
  }
}

@State<TodoResponse>({
  name: 'todoResponse',
  defaults: {
    todos: [],
    flag: 'all',
  },
})
@Injectable()
export class TodoState {
  constructor(private todoService: TodoService) {}
  @Action(Todos.GetAllTodos)
  getAllTodos(context: StateContext<TodoResponse>, action: Todos.GetAllTodos) {
    return this.todoService.getTodos(action.flag).pipe(
      tap((response) => {
        const state = context.getState();
        context.setState({
          ...state,
          ...(response as TodoResponse),
        });
      })
    );
  }
  @Action(Todos.AddTodo)
  addTodo(context: StateContext<TodoResponse>, action: Todos.AddTodo) {
    return this.todoService.addTodo(action.todo).pipe(
      tap((todo) => {
        const { todos, flag } = context.getState();
        context.patchState({
          flag,
          todos: [todo, ...todos],
        });
      })
    );
  }
  @Action(Todos.RemoveTodoById)
  removeTodoById(
    context: StateContext<TodoResponse>,
    action: Todos.RemoveTodoById
  ) {
    return this.todoService.removeTodo(action.id).pipe(
      tap(() => {
        const { todos, flag } = context.getState();
        context.patchState({
          flag,
          todos: todos.filter((item) => item.id !== action.id),
        });
      })
    );
  }
  @Action(Todos.UpdateTodo)
  updateTodo(_: any, action: Todos.UpdateTodo) {
    return this.todoService.updateTodo(action.todo).subscribe();
  }

  @Selector([TodoState])
  static selectTodos(state: TodoResponse) {
    return state;
  }
}
