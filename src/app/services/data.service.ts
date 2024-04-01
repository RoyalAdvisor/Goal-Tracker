import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import type { Todo } from '../types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class DataService implements InMemoryDbService {
  constructor(private storageService: StorageService) {}
  createDb() {
    const todos: Todo[] = this.storageService.getStoredData('todos');
    return { todos };
  }
}
