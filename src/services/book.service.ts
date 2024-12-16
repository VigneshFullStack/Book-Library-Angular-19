import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/Book';
import { apiUrl } from '../api/Api';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() {}

  // Using Observable with fetch API
  getBooks(): Observable<Book[]> {
    return new Observable<Book[]>((observer) => {
      fetch(`${apiUrl}/books`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch books');
          }
          return response.json();
        })
        .then((books: Book[]) => {
          observer.next(books);
          observer.complete();
        })
        .catch((error) => {
          observer.error('Error fetching books: ' + error);
        });
    });
  }
}