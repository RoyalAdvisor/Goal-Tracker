import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  constructor(private http: HttpClient) {}
  private baseUrl =
    'https://api.api-ninjas.com/v1/quotes?category=inspirational';
  private apiKey = process.env['QUOTES_TOKEN'];
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': `${this.apiKey}`,
    }),
  };
  getQuote(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, this.options);
  }
}
