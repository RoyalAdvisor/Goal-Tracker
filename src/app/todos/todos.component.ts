import { Component, ViewChild, ElementRef } from '@angular/core';
import { UpperCasePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../types';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [UpperCasePipe, NgFor, NgIf, FormsModule, TodoItemComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  @ViewChild('todoDescription') todoDescription: ElementRef | undefined;

  constructor(private todoService: TodoService) {}
  private generateTodoId(length: number): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }

  todos: Todo[] = [];
  filters = ['all', 'active', 'completed'];

  getTodos(flag: string): void {
    this.todoService
      .getTodos(flag)
      .subscribe((todos) => (this.todos = todos.reverse()));
  }

  filterTodos(flag: string): void {
    this.getTodos(flag);
  }

  onHandleComplete(flag: string): void {
    this.getTodos(flag);
  }

  addNewTodo(description: string): void {
    if (!description) return;
    const todo: Todo = {
      id: this.generateTodoId(10),
      description,
      createdAt: new Date().toLocaleDateString('en-ZA'),
      status: 'active',
    };
    this.todoService.addTodo(todo).subscribe();
    this.getTodos('all');
  }

  deleteTodo(todo: Todo): void {
    const index = this.todos.indexOf(todo);
    this.todos = this.todos.splice(index, 1);
    this.todoService.removeTodo(todo.id).subscribe();
  }

  ngOnInit(): void {
    this.getTodos('all');
  }
  ngAfterViewInit() {
    this.todoDescription?.nativeElement.focus();
  }
}
