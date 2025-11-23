import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { BookService } from '../../services/book.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    InputTextareaModule,
    ButtonModule
  ],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  opinions: any[] = [];

  // Ya NO tiene rating
  newOpinion = {
    comment: ''
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadOpinions();
  }

  // ===============================
  // Cargar opiniones
  // ===============================
  loadOpinions(): void {
    this.bookService.getAllOpinions().subscribe({
      next: (data: any[]) => {

        console.log("Opiniones cargadas:", data);

        // Map para garantizar date y userName
        this.opinions = data
          .map(op => ({
            id: op.id,
            userName: op.userName,
            comment: op.comment,
            date: op.date || op.Date // Por si viene mayúscula
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => {
        console.error('Error al cargar opiniones', err);
        alert('Error al cargar opiniones');
      }
    });
  }

  // ===============================
  // Agregar opinión
  // ===============================
  addOpinion(): void {
    if (!this.newOpinion.comment.trim()) {
      alert('Debes completar tu comentario');
      return;
    }

    this.bookService.addOpinion({ comment: this.newOpinion.comment }).subscribe({
      next: () => {
        this.newOpinion.comment = '';
        this.loadOpinions();
      },
      error: (err) => {
        console.error('Error al publicar opinión', err);
        alert('Error al publicar opinión');
      }
    });
  }
}
