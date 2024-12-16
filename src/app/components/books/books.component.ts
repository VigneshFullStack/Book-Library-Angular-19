import { Component } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/Book';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {
  books: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(
      (data) => {
        this.books = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.errorMessage = 'Error fetching books. Please try again later.';
        this.loading = false;
      }
    );
  }

  // Method to download the data as a text file
  downloadText(): void {
    const text = this.books.map(book => `Title: ${book.title}, Author: ${book.authorName}, Genre: ${book.genreName}, Year: ${book.publicationYear}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'books.txt';
    link.click();
  }

  // Method to download the data as a PDF
  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Book Details', 14, 16);

    // Dynamically extract the headers from the first book object
    const headers = Object.keys(this.books[0] || {});

    // Format the table data
    const tableData = this.books.map(book => [book.bookId, book.title, book.authorId, book.genreId, book.authorName, book.genreName, book.publicationYear]);

    // Ensure autoTable is called on the jsPDF instance
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      margin: { top: 20 }
    });

    // Save the PDF
    doc.save('books.pdf');
  }

  // Method to download the data as an Excel file
  downloadExcel(): void {
    const ws = XLSX.utils.json_to_sheet(this.books);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Books');
    XLSX.writeFile(wb, 'books.xlsx');
  }
}