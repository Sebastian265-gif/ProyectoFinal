import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BookService } from '../../services/book.service';
import { MessageModule } from 'primeng/message';
import { catchError,of } from 'rxjs';


@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [InputTextModule, CommonModule, ReactiveFormsModule,ButtonModule, FormsModule, MessageModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {

  booksForm: FormGroup;
  successMessage: string = '';
  errMessage: string = '';

  constructor( private fb: FormBuilder, private bookService: BookService){
    
    this.booksForm = this.fb.group(
      {
        Id: ['',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]], 
        tittle: ['',Validators.required], 
        author: ['',Validators.required],
        editorial: ['',Validators.required],
        pages: ['',Validators.required]
      }
    );
  }

// Conectar con el servicio
  onSubmit() {
    if (this.booksForm.valid) 
    {
      const {Id,tittle,author,editorial,pages} = this.booksForm.value;
      this.bookService.addBook(Id,tittle,author,editorial,pages).pipe(
        catchError( (err) => 
          {
            if (err.status == 200){
              return of(null);
            }
            throw err;
          }
        )
      ).subscribe
      ({
        next:() => 
          {
            this.successMessage = 'Libro añadido exitosamente!';
            this.errMessage = '';
            this.booksForm.reset()
          },
        error:() => 
          {
            this.errMessage = 'Libro existente!';
            this.successMessage = '';
          }
        }
      )
    }else
    {
      console.log('Formulario invalido!');
    }
  }
}
