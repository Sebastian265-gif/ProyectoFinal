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

@Component({
  selector: 'app-search-id-book',
  standalone: true,
  imports: [CommonModule,TableModule,ButtonModule,InputTextModule,FormsModule,ReactiveFormsModule, CardModule, DropdownModule],
  templateUrl: './search-id-book.component.html',
  styleUrl: './search-id-book.component.css'
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

  loadIds(): void{
    this.BookService.idBooks().subscribe({
      next: (Ids) => {this.Ids = Ids},
      error: () => {this.errorMessage = "Error cargando IDS"}
    })
  }

  searchIdBook():void{
    if(!this.bookId){
      this.errorMessage = 'Por favor, ingresa un ID válido';
      return;
    }

    this.isLoading = true;

    this.BookService.getBookbyId(this.bookId).subscribe({
      next: (book) => {
        this.books = book ? [book]: [];
        this.errorMessage = this.books.length ? '':'No se encontro ninugn usuario con este Id';
      },
      error: () => {
        this.errorMessage = 'Error al buscar el libro con el ID ingresado';
        this.books = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  gotoEdit(id: string): void{
    this.router.navigate(['/updatebook', id]);
  }

  gotoDelete(id: string): void{
    this.router.navigate(['/deletebook', id]);
  }
}
