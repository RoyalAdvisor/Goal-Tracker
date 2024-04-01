import { Injectable } from '@angular/core';
import type { Todo } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public getStoredData(key: string): Todo[] {
    const storedData =
      localStorage.getItem(key) !== null
        ? Array.from(JSON.parse(localStorage.getItem(key) as string))
        : [];
    return storedData as Todo[];
  }

  public saveDataToStorage(key: string, value: Todo): void {
    const storedData = this.getStoredData(key);
    storedData.push(value);
    localStorage.setItem(key, JSON.stringify(storedData));
  }

  public updateStoredData(key: string, value: Todo): void {
    const storedData = this.getStoredData(key);
    storedData.forEach((item, index) => {
      if (value.id === item.id) storedData[index] = value;
    });
    localStorage.setItem(key, JSON.stringify(storedData));
  }

  public removeItemFromStorage(key: string, id: string): void {
    const storedData = this.getStoredData(key);
    const index = storedData.findIndex((item) => item.id === id);
    if (index !== -1) storedData.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(storedData));
  }

  public clearStoredData(): void {
    return localStorage.clear();
  }
}
