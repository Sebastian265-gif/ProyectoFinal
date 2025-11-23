import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BookService } from '../../services/book.service';
import { MessageModule } from 'primeng/message';
import { catchError, of } from 'rxjs';
import { ElementRef, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    MessageModule,
    DropdownModule
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {

  booksForm: FormGroup;
  selectedFile: File | null = null;
  
  generos = [
    { label: 'Fantasía', value: 'Fantasía' },
    { label: 'Ciencia Ficción', value: 'Ciencia Ficción' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Historia', value: 'Historia' },
    { label: 'Realismo mágico', value: 'Realismo mágico' },
    { label: 'Misterio', value: 'Misterio' },
    { label: 'Terror', value: 'Terror' },
    { label: 'Distopía', value: 'Distopía' },
    { label: 'Otro', value: 'Otro' }
  ];

  // <-- Aquí se guarda la imagen

  @ViewChild('fileInput') fileInput!: ElementRef;


  successMessage: string = '';
  errMessage: string = '';

  constructor(private fb: FormBuilder, private bookService: BookService) {

    this.booksForm = this.fb.group({
      Id: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      tittle: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required],
      pages: ['', Validators.required],
      genero: ['', Validators.required],
      cover: [''] // <-- Campo extra para la imagen
    });
  }

  // =====================================================
  // 🟦 MÉTODO CORRECTO QUE FALTABA (EVITA EL ERROR NG9)
  // =====================================================
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  // =====================================================
  resetForm() {
    this.booksForm.reset();
    this.selectedFile = null;
    
    if (this.fileInput) {
      const input = this.fileInput.nativeElement;
      input.type = 'text';
      input.type = 'file';
  }
  }
  onSubmit() {
    if (this.booksForm.valid) {

      const formData = new FormData();
      formData.append("Id", this.booksForm.value.Id);
      formData.append("tittle", this.booksForm.value.tittle);
      formData.append("author", this.booksForm.value.author);
      formData.append("editorial", this.booksForm.value.editorial);
      formData.append("pages", this.booksForm.value.pages);
      formData.append("genero", this.booksForm.value.genero);
      
      if (this.selectedFile) {
        formData.append("Cover", this.selectedFile);
      }

      this.bookService.addBookWithImage(formData)
        .pipe(
          catchError(err => {
            if (err.status === 200) return of(null);
            throw err;
          })
        )
        .subscribe({
          next: () => {
            this.successMessage = "Libro añadido exitosamente!";
            this.errMessage = "";
            
            this.resetForm(); 
          },
          error: () => {
            this.errMessage = "Error al registrar el libro (puede que ya exista).";
            this.successMessage = "";
          }
        });

    } else {
      console.log("Formulario inválido!");
    }
  }
}

