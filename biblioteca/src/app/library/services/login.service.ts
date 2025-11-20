import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //Url del API almacenada de forma privada
  apiUrl = "https://localhost:7255/api/Users";

  constructor(private http: HttpClient) { }

  // Observable es un objeto que representa un flujo de datos que se pueden manejar 
  // de forma asíncrona. Los Observables son parte de la biblioteca RxJS (Reactive Extensions for JavaScript) 
  // y se utilizan principalmente para manejar eventos o flujos de datos que pueden ocurrir en el futuro, 
  // como respuestas de peticiones HTTP, eventos del usuario - se controla con HttpClientModule

  login(username: string, password: string): Observable<any> {
    
    //return this.http.post(this.apiUrl, {username, password});

    //const body = { username, password };

    return this.http.post
    (`${this.apiUrl}/login`,
      { username, password }
    
    );
    
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data)

  }

  updateUser(id: string, username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.put(`${this.apiUrl}/update/${id}`, body);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

//Obtener todos los usuarios desde el backend
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getusers`);
  }







  //Obtener usuario por su Id
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserById/${userId}`);
  } 



}
