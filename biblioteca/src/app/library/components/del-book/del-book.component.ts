import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-del-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule, CardModule, DropdownModule, DialogModule],
  templateUrl: './del-book.component.html',
  styleUrls: ['./del-book.component.css']
})
export class DelBookComponent {
  deleteForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  bookIds: { label: string; value: string }[] = [];
  displayModal: boolean = false;

  private bookToDelete: string = '';

  constructor(private fb: FormBuilder, private bookService: BookService){
    this.deleteForm = this.fb.group({
      bookId: ['', Validators.required],
    });

    this.loadBookIds();
  }

  loadBookIds(): void {
    this.bookService.idBooks().subscribe((ids: string[]) => {
      this.bookIds = ids.map(id => ({ label: id, value: id }));
    });
  }

  confirmDelete(): void {
    if(this.deleteForm.valid){
      this.bookToDelete = this.deleteForm.value.bookId;
      this.displayModal = true;
    }
  }

  deleteBook(): void {
    this.displayModal = false;
    this.successMessage = '';
    this.errorMessage = '';

    this.bookService.deleteBook(this.bookToDelete).pipe(
      catchError(err => {
        if(err.status === 200) return of(null);
        throw(err);
      })
    ).subscribe({
      next: () => {
        this.successMessage = 'Libro eliminado con éxito';
        this.deleteForm.reset();
      },
      error: () => {
        this.errorMessage = 'Hubo un error al eliminar el libro';
      }
    });
  }
}
