import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-search-books',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    ProgressBarModule
  ],
  templateUrl: './search-books.component.html',
  styleUrls: ['./search-books.component.css']
})
export class SearchBooksComponent implements OnInit {
  allBooks: any[] = [];        // Todos los libros
  displayedBooks: any[] = [];  // Libros que se muestran (filtrados)
  selectedGenre: string = '';

  genreOptions: any[] = [];

  showProgressModal = false;
  selectedBook: any = null;
  newPage: number = 0;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.listBooks().subscribe({
      next: books => {
        const mappedBooks = books.map(book => {
          const currentPage = book.current_page ?? 0;
          return {
            ...book,
            currentPage: currentPage,
            progress: book.pages > 0 ? Math.round((currentPage / book.pages) * 100) : 0,
            cover: book.cover ? 'https://localhost:7255' + book.cover : null
          };
        });

        this.allBooks = mappedBooks;
        this.displayedBooks = [...this.allBooks]; // inicialmente todos

        const uniqueGeneros = Array.from(new Set(mappedBooks.map(b => b.genero).filter(g => g)));
        this.genreOptions = uniqueGeneros.map(g => ({ label: g, value: g }));
      },
      error: () => alert('Error al listar libros!')
    });
  }

  filterBooks(): void {
    if (!this.selectedGenre) {
      this.displayedBooks = [...this.allBooks];
    } else {
      this.displayedBooks = this.allBooks.filter(book => book.genero === this.selectedGenre);
    }
  }

  // TRACKBY PARA MANTENER LA ORGANIZACIÓN AL FILTRAR
  trackByBookId(index: number, book: any): string {
    return book.id;
  }

  getProgressClass(progress: number): string {
    if (progress <= 40) return 'progress-red';
    if (progress <= 60) return 'progress-orange';
    if (progress <= 80) return 'progress-yellow';
    return 'progress-green';
  }

  gotoEdit(id: string) {
    this.router.navigate(['/updatebook', id]);
  }

  gotoDelete(id: string) {
    this.router.navigate(['/deletebook', id]);
  }

  openProgressModal(book: any) {
    this.selectedBook = book;
    this.newPage = book.currentPage;
    this.showProgressModal = true;
  }

  closeProgressModal() {
    this.showProgressModal = false;
    this.selectedBook = null;
    this.newPage = 0;
  }

  saveProgress() {
    if (!this.selectedBook) return;
    this.bookService.updateProgress(this.selectedBook.id, this.newPage).subscribe({
      next: () => {
        this.closeProgressModal();
        this.loadBooks();
      },
      error: () => alert("Error al guardar progreso")
    });
  }
}
