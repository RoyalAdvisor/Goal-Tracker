import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Todo } from '../types';
import { NgClass, NgIf } from '@angular/common';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo?: Todo;
  @Input() todos?: Todo[];
  @Output() onNewTodos = new EventEmitter<string>();

  constructor(private todoService: TodoService) {}

  deleteTodo(todo: Todo): void {
    const index = this.todos?.indexOf(todo) as number;
    this.todos = this.todos?.splice(index, 1);
    this.todoService.removeTodo(todo.id).subscribe();
  }

  handleStatus(todo: Todo): void {
    const updatedTodo: Todo = {
      ...todo,
      status: todo.status === 'active' ? 'completed' : 'active',
    };
    this.todoService.updateTodo(updatedTodo).subscribe();
    this.onNewTodos.emit('all');
  }
}
