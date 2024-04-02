import { Component, ViewChild, ElementRef } from '@angular/core';
import { UpperCasePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodoFilterFlag, TodoResponse } from '../../models/Todo';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../../services/todo.service';
import { Select, Store } from '@ngxs/store';
import { GetAllTodos, TodoState } from '../../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    UpperCasePipe,
    NgFor,
    NgIf,
    NgClass,
    FormsModule,
    TodoItemComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  @ViewChild('todoDescription') todoDescription: ElementRef | undefined;
  @Select(TodoState.selectTodos) todosWithFilter$!: Observable<TodoResponse>;
  constructor(private todoService: TodoService, private store: Store) {}
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
  filters: TodoFilterFlag[] = ['all', 'active', 'completed'];
  activeFlag: TodoFilterFlag = 'all';

  getAndFilterTodos(flag: TodoFilterFlag): void {
    this.store
      .dispatch(new GetAllTodos(flag))
      .subscribe((response) => (this.todos = response.todoResponse.todos));
    this.activeFlag = flag;
  }

  onHandleComplete(flag: TodoFilterFlag): void {
    this.getAndFilterTodos(flag);
  }

  addNewTodo(description: string): void {
    this.activeFlag = 'active';
    if (!description) return;
    const todo: Todo = {
      id: this.generateTodoId(10),
      description,
      createdAt: new Date().toLocaleDateString('en-ZA'),
      status: 'active',
    };
    this.todoService.addTodo(todo).subscribe();
    this.getAndFilterTodos(this.activeFlag);
  }

  deleteTodo(todo: Todo): void {
    const index = this.todos.indexOf(todo);
    this.todos = this.todos.splice(index, 1);
    this.todoService.removeTodo(todo.id).subscribe();
  }

  ngOnInit(): void {
    this.todosWithFilter$.subscribe({
      next: (response) => {
        if (!response.todos.length) {
          this.store
            .dispatch(new GetAllTodos(this.activeFlag))
            .subscribe(
              (response) => (this.todos = response.todoResponse.todos)
            );
          return;
        }
        this.todos = response.todos;
        this.activeFlag = response.flag;
      },
    });
  }

  ngAfterViewInit() {
    this.todoDescription?.nativeElement.focus();
  }
}
