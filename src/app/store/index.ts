import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TodoFilterFlag, TodoResponse } from '../models/Todo';
import { Injectable } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { tap } from 'rxjs';

export class GetAllTodos {
  static readonly type = '[Todo] Get All';
  constructor(public flag: TodoFilterFlag) {}
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
  @Action(GetAllTodos)
  getAllTodos(context: StateContext<TodoResponse>, action: GetAllTodos) {
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

  @Selector([TodoState])
  static selectTodos(state: TodoResponse) {
    return state;
  }
}
