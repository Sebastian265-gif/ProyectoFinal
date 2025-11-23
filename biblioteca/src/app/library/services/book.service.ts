import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) {}

  apiUrl = "https://localhost:7255/api/Books";

  // ========================================
  // HEADERS CON TOKEN
  // ========================================
  private getHeaders() {
    const token = localStorage.getItem("token");

    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });
  }

  // ========================================
  // AGREGAR LIBRO (NO ENVÍES user_id)
  // ========================================
  addBook(Id: string, tittle: string, author: string, editorial: string, pages: number): Observable<any> {

    const body = {
      id: Id,
      tittle,
      author,
      editorial,
      pages
    };

    return this.http.post(`${this.apiUrl}/addBook`, body, {
      headers: this.getHeaders()
    });
  }

  // ========================================
  // ACTUALIZAR LIBRO (NO ENVÍES user_id)
  // ========================================
  updateBook(Id: string, tittle: string, author: string, editorial: string, pages: number): Observable<any> {

    const body = {
      id: Id,
      tittle,
      author,
      editorial,
      pages
    };

    return this.http.put(`${this.apiUrl}/updateBook/${Id}`, body, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  // ========================================
  // LISTAR LIBROS (PROTEGIDO)
  // ========================================
  listBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listBooks`, {
      headers: this.getHeaders()
    });
  }

  // ========================================
  // OBTENER SOLO IDs (PROTEGIDO)
  // ========================================
  idBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/idBooks`, {
      headers: this.getHeaders()
    });
  }

  // ========================================
  // BUSCAR LIBRO POR ID
  // ========================================
  getBookbyId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/searchBook/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ========================================
  // ELIMINAR LIBRO
  // ========================================
  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteBook/${id}`, {
      headers: this.getHeaders()
    });
  }

  addBookWithImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.post(`${this.apiUrl}/addBookWithImage`, formData, {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${token}`
        // NO PONGAS Content-Type → Angular lo pone solo con FormData
      })
    });
  }

  updateBookWithImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.put(`${this.apiUrl}/updateBookWithImage/${formData.get("Id")}`, formData, {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${token}`
      })
    });
  }

  // ========================================
// ACTUALIZAR PROGRESO DEL LIBRO
// ========================================
updateProgress(id: string, page: number): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.put(
      `${this.apiUrl}/updateProgress/${id}?page=${page}`,
      {}, // cuerpo vacío
      {
        headers: new HttpHeaders({
          "Authorization": `Bearer ${token}`
        })
      }
    );
  }
// ============================
// OPINIONES COMUNIDAD
// ============================
// Obtener todas las opiniones
getAllOpinions(): Observable<any[]> {
  const token = localStorage.getItem("token");
  return this.http.get<any[]>(`https://localhost:7255/api/Opinions`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

// Agregar opinión (sin UserName)
addOpinion(opinion: { comment: string;}): Observable<any> {
  const token = localStorage.getItem("token");
  return this.http.post(`https://localhost:7255/api/Opinions`, opinion, {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });
}

// Calificar opinión
rateOpinion(rate: { OpinionId: number; Rating: number }): Observable<any> {
  const token = localStorage.getItem("token");
  return this.http.post(`https://localhost:7255/api/Opinions/Rate`, rate, {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
  });
}


}


