import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  // Kubernetes service name + port
  private baseUrl: string = 'http://52.224.87.132:30081';

  constructor(private http: HttpClient) {}

  // GET all books
  getBooks() {
    return this.http.get<any>(`${this.baseUrl}/allBooks`);
  }

  // ADD book
  postBook(data: any) {
    return this.http.post<any>(`${this.baseUrl}/addBook`, data);
  }

  // UPDATE book
  putBook(data: any, bookId: number) {
    return this.http.put<any>(`${this.baseUrl}/updateBook/${bookId}`, data);
  }

  // DELETE book
  deleteBook(bookId: number) {
    return this.http.delete<any>(`${this.baseUrl}/deleteBook/${bookId}`);
  }
}


