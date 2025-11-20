import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
  updateForm!: FormGroup;
  Ids: any[] = [];
  successMessage = '';
  errMessage = '';

  constructor(private fb: FormBuilder, private bookService: BookService) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      Id: ['', Validators.required],
      tittle: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required],
      pages: ['', Validators.required],
    });

    this.loadIds();
  }

  loadIds(): void {
    this.bookService.idBooks().subscribe({
      next: (ids) => {
        this.Ids = ids.map((x: any) => ({ label: x, value: x }));
      },
      error: (err) => {
        if (err.status === 404) {
          this.errMessage = "No se encontraron libros para este usuario (404)";
        } else if (err.status === 401) {
          this.errMessage = "No autorizado. Inicie sesión nuevamente.";
        } else {
          this.errMessage = "Error al cargar los ID's";
        }
      }
    });
  }

  onIdChange(event: any) {
    const selectedId = event.value;
    if (!selectedId) return;

    this.bookService.getBookbyId(selectedId).subscribe({
      next: (book) => {
        this.updateForm.patchValue({
          tittle: book.tittle,
          author: book.author,
          editorial: book.editorial,
          pages: book.pages
        });
        this.errMessage = '';
        this.successMessage = '';
      },
      error: () => {
        this.errMessage = "Error al cargar datos del libro.";
      }
    });
  }

  onSubmit(): void {
    if (!this.updateForm.valid) return;

    const { Id, tittle, author, editorial, pages } = this.updateForm.value;

    // Llamada al servicio
    this.bookService.updateBook(Id, tittle, author, editorial, pages)
      .subscribe({
        next: (res) => {
          console.log('Respuesta backend:', res);
          // Como el backend devuelve texto plano, mostramos siempre mensaje de éxito
          this.successMessage = "Libro actualizado correctamente!";
          this.errMessage = '';
        },
        error: (err) => {
          console.error('Error backend:', err);
          // Si hay error, mostramos mensaje
          this.errMessage = err.error || "Error al actualizar el libro";
          this.successMessage = '';
        }
      });
  }
}
