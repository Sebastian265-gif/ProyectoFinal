import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BookService } from '../../services/book.service';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-search-id-book',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    DropdownModule,
    ProgressBarModule
  ],
  templateUrl: './search-id-book.component.html',
  styleUrls: ['./search-id-book.component.css']
})
export class SearchIdBookComponent {
  Ids: any[] = [];
  books: any[] = [];
  bookId: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private BookService: BookService, private router: Router){
    this.loadIds();
  }

  loadIds(): void {
    this.BookService.idBooks().subscribe({
      next: (Ids) => { this.Ids = Ids; },
      error: () => { this.errorMessage = "Error cargando IDS"; }
    });
  }

  searchIdBook(): void {
    if(!this.bookId){
      this.errorMessage = 'Por favor, ingresa un ID válido';
      return;
    }

    this.isLoading = true;
    this.BookService.getBookbyId(this.bookId).subscribe({
      next: (book) => {
        if (book) {
          const currentPage = book.current_page ?? 0;
          const progress = book.pages > 0 ? Math.round((currentPage / book.pages) * 100) : 0;
          const bookWithCover = {
            ...book,
            cover: book.cover ? 'https://localhost:7255' + book.cover : null,
            progress: progress,
            progressText: `${currentPage} / ${book.pages} páginas`
          };
          this.books = [bookWithCover];
          this.errorMessage = '';
        } else {
          this.books = [];
          this.errorMessage = 'No se encontró ningún libro con este ID';
        }
      },
      error: () => {
        this.books = [];
        this.errorMessage = 'Error al buscar el libro con el ID ingresado';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  gotoEdit(id: string): void {
    this.router.navigate(['/updatebook', id]);
  }

  gotoDelete(id: string): void {
    this.router.navigate(['/deletebook', id]);
  }
}
