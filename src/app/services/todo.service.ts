import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, TodoFilterFlag, TodoResponse } from '../models/Todo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  private baseUrl = 'api/todos';
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private filterData(flag: TodoFilterFlag, data: Todo[]): TodoResponse {
    if (flag === 'all') return { todos: data.reverse(), flag };
    else {
      const filteredTodos = data
        .filter((item) => item.status === flag)
        .reverse();
      return {
        todos: filteredTodos,
        flag,
      };
    }
  }

  private errorHandler<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      console.error(`${operation}`);
      return of(result as T);
    };
  }

  getTodos(flag: TodoFilterFlag): Observable<TodoResponse | Todo[]> {
    return this.http.get<TodoResponse | Todo[]>(this.baseUrl).pipe(
      map((data) => this.filterData(flag, data as Todo[])),
      catchError(this.errorHandler<Todo[]>('Failed to fetch todos.', []))
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put(this.baseUrl, todo, this.options).pipe(
      tap((_) => this.storageService.updateStoredData('todos', todo)),
      catchError(this.errorHandler<any>(`Failed to update: ID=${todo.id}`))
    );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, todo, this.options).pipe(
      tap((data) => this.storageService.saveDataToStorage('todos', data)),
      catchError(this.errorHandler<Todo>(`Failed to add: ID=${todo.id}`))
    );
  }

  removeTodo(id: string): Observable<Todo> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Todo>(url, this.options).pipe(
      tap((_) => this.storageService.removeItemFromStorage('todos', id)),
      catchError(this.errorHandler<Todo>(`Failed to delete: ID=${id}`))
    );
  }
}
