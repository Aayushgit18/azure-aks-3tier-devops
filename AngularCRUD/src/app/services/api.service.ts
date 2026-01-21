import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
<<<<<<< HEAD
  baseUrl = '/api';
=======

  // Kubernetes service name + port
  private baseUrl: string = 'http://52.224.87.132:30081';
>>>>>>> e30ad0327d633ca43c5e59ac6f9c993bd6f60910

  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<any>(`${this.baseUrl}/allBooks`);
  }

  postBook(data: any) {
    return this.http.post<any>(`${this.baseUrl}/addBook`, data);
  }

  putBook(data: any, bookId: number) {
    return this.http.put<any>(`${this.baseUrl}/updateBook/${bookId}`, data);
  }

  deleteBook(bookId: number) {
    return this.http.delete<any>(`${this.baseUrl}/deleteBook/${bookId}`);
  }
}


