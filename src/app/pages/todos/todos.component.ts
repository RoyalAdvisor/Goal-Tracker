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
  constructor(private store: Store) {}
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
  // private generateCounts(arr: Todo[]): TodoFilterFlagCounts[] {
  //   const groupedCounts: TodoFilterFlagCounts[] = [];
  //   const groupedTodos = arr.reduce((acc: { [key: string]: any }, curr) => {
  //     const key = curr['status'];
  //     acc[key] = (acc[key] || []).concat(curr);
  //     return acc;
  //   }, []);
  //   Object.entries(groupedTodos).forEach(([key, value]) => {
  //     groupedCounts.push({
  //       flag: key as TodoFilterFlag,
  //       count: value.length,
  //     });
  //   });
  //   return groupedCounts;
  // }

  todos: Todo[] = [];
  // activeCounts: TodoFilterFlagCounts[] = [
  //   { flag: 'all', count: 0 },
  //   { flag: 'active', count: 0 },
  //   { flag: 'completed', count: 0 },
  // ];
  filters: TodoFilterFlag[] = ['all', 'active', 'completed'];
  activeFlag: TodoFilterFlag = 'all';

  getAndFilterTodos(flag: TodoFilterFlag): void {
    this.store.dispatch(new Todos.GetAllTodos(flag)).subscribe((response) => {
      this.todos = response.todoResponse.todos;
    });
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
    this.store.dispatch(new Todos.AddTodo(todo)).subscribe();
  }

  ngOnInit(): void {
    this.todosWithFilter$.subscribe({
      next: (response) => {
        if (!response.todos.length) {
          this.store
            .dispatch(new Todos.GetAllTodos(this.activeFlag))
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
