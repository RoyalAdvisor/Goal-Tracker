import { Component, ViewChild, ElementRef } from '@angular/core';
import { UpperCasePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Todo,
  TodoFilterFlag,
  TodoFilterFlagCounts,
  TodoResponse,
} from '../../models/Todo';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../../services/todo.service';
import { Select, Store } from '@ngxs/store';
import { Todos, TodoState } from '../../store/Todos';
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
  constructor(private store: Store, private todoService: TodoService) {}
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
  activeCounts: TodoFilterFlagCounts[] = [
    { flag: 'all', count: 0 },
    { flag: 'active', count: 0 },
    { flag: 'completed', count: 0 },
  ];
  activeFlag: TodoFilterFlag = 'all';
  totalCount: number = 0;

  filterTodos(flag: TodoFilterFlag): void {
    this.todosWithFilter$.subscribe((response) => {
      if (flag === 'all') {
        this.todos = response.todos;
        return;
      }
      this.todos = response.todos.filter((todo) => todo.status === flag);
    });
    this.activeFlag = flag;
  }

  onHandleComplete(flag: TodoFilterFlag): void {
    this.store.dispatch(new Todos.GetAllTodos(flag)).subscribe((response) => {
      this.todos = response.todoResponse.todos;
    });
  }

  addNewTodo(description: string): void {
    this.activeFlag = 'active';
    if (!description) return;
    const todo: Todo = {
      id: this.generateTodoId(10),
      description,
      createdAt: new Date().toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'active',
    };
    this.store.dispatch(new Todos.AddTodo(todo)).subscribe();
    this.filterTodos(this.activeFlag);
  }

  ngOnInit(): void {
    this.todosWithFilter$.subscribe({
      next: (response) => {
        if (!this.todos.length) {
          this.store
            .dispatch(new Todos.GetAllTodos(this.activeFlag))
            .subscribe(
              (response) => (this.todos = response.todoResponse.todos)
            );
          return;
        }
        this.todos = response.todos;
        this.totalCount = this.todos.length;
        this.activeCounts = this.todoService.countTodosByStatus(response.todos);
      },
    });
  }

  ngAfterViewInit() {
    this.todoDescription?.nativeElement.focus();
  }
}
