import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { catchError,of } from 'rxjs';

@Component({
  selector: 'app-del-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, FormsModule, InputTextModule, MessageModule, CardModule],
  templateUrl: './del-book.component.html',
  styleUrl: './del-book.component.css'
})
export class DelBookComponent {
  deleteForm: FormGroup;

  succesMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private BookService: BookService){
    this.deleteForm = this.fb.group({
      bookId: ['', Validators.required],
    })
  }

  onDelete():void{
    if(this.deleteForm.valid){
      this.succesMessage = "";
      this.errorMessage = "";

      const {bookId} = this.deleteForm.value;
      this.BookService.deleteBook(bookId).pipe(
        catchError((err) =>
        {
          if (err.status == 200) {
            return of(null)
          }
          throw(err)
        }
      )).subscribe({
        next: () => {
          this.succesMessage = "Libro Eliminado con exito";
          this.deleteForm.reset();
        },
        error: () => {
          this.errorMessage = "Hubo un error al eliminar el libro"
        },
        complete:() => console.log('Complete'),
      })
    }
  }
}
