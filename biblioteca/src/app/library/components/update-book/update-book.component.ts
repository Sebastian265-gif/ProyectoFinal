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
  selectedFile: File | null = null;
  currentCover: string | null = null; // URL de la portada actual

  constructor(private fb: FormBuilder, private bookService: BookService) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      Id: ['', Validators.required],
      tittle: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required],
      pages: ['', Validators.required],
      Cover: [null]
    });

    this.loadIds();
  }

  loadIds(): void {
    this.bookService.idBooks().subscribe({
      next: (ids) => {
        this.Ids = ids.map((x: any) => ({ label: x, value: x }));
      },
      error: (err) => {
        this.errMessage = err.error || "Error al cargar los ID's";
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
        this.currentCover = book.cover ? `https://localhost:7255${book.cover}` : null;
        this.selectedFile = null; // Limpia selección de archivo
        this.errMessage = '';
        this.successMessage = '';
      },
      error: () => {
        this.errMessage = "Error al cargar datos del libro.";
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  resetForm() {
    this.updateForm.reset();   // limpia todos los campos
    this.selectedFile = null;  // limpia archivo seleccionado
    this.currentCover = null;  // limpia portada
  }

  onSubmit(): void {
    if (!this.updateForm.valid) return;

    const { Id, tittle, author, editorial, pages } = this.updateForm.value;

    const formData = new FormData();
    formData.append("Id", Id);
    formData.append("Tittle", tittle);
    formData.append("Author", author);
    formData.append("Editorial", editorial);
    formData.append("Pages", pages.toString());
    if (this.selectedFile) {
      formData.append("Cover", this.selectedFile);
    }

    this.bookService.updateBookWithImage(formData).subscribe({
      next: () => {
        this.successMessage = "Libro actualizado correctamente!";
        this.errMessage = '';

        if (this.selectedFile) {
          // Actualiza la portada mostrada si hubo un cambio
          const reader = new FileReader();
          reader.onload = () => this.currentCover = reader.result as string;
          reader.readAsDataURL(this.selectedFile);
        }

        this.resetForm();
      },
      error: (err) => {
        this.errMessage = err.error || "Error al actualizar el libro";
        this.successMessage = '';
      }
    });
  }
}
