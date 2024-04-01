import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { Todo } from '../types';
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
  private filterData(flag: string, data: Todo[]): Todo[] {
    if (flag === 'all') return data;
    else return data.filter((item) => item.status === flag);
  }

  private errorHandler<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      console.error(`${operation}`);
      return of(result as T);
    };
  }

  getTodos(flag: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl).pipe(
      map((data) => this.filterData(flag, data)),
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
