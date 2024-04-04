import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo, TodoFilterFlag, TodoResponse } from '../../models/Todo';
import { NgClass, NgIf } from '@angular/common';
import { TodoState, Todos } from '../../store/Todos';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo?: Todo;
  @Output() onNewTodos = new EventEmitter<TodoFilterFlag>();
  @Select(TodoState.selectTodos) todosWithFilter$!: Observable<TodoResponse>;

  constructor(private store: Store) {}

  deleteTodo(todo: Todo): void {
    this.store.dispatch(new Todos.RemoveTodoById(todo.id)).subscribe();
  }

  handleStatus(todo: Todo): void {
    const updatedTodo: Todo = {
      ...todo,
      status: todo.status === 'active' ? 'completed' : 'active',
    };
    this.store.dispatch(new Todos.UpdateTodo(updatedTodo)).subscribe();
    this.onNewTodos.emit('all');
  }
}
