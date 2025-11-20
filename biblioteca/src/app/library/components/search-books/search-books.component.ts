import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-books',
  standalone: true,
  imports: [TableModule, CardModule, ButtonModule, ProgressBarModule, CommonModule],
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.css']
})
export class SearchBooksComponent implements OnInit {

  books: any[] = [];
  errorMessage: string = '';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.listBooks().subscribe({
      next: (books) => {
        // Inicializamos progress y cover por si no existen
        this.books = books.map(book => ({
          ...book,
          progress: book.progress || 0,
          cover: book.cover || null
        }));
      },
      error: () => {
        this.errorMessage = 'Error al listar libros!';
      }
    });
  }

  gotoEdit(bookId: string) {
    this.router.navigate(['/updatebook', bookId]);
  }

  gotoDelete(bookId: string) {
    this.router.navigate(['/deletebook', bookId]);
  }
}
