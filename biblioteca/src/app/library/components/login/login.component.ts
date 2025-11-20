import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,CardModule, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  myForm!: FormGroup;
  errorMsg: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]]
    });
  }

  onSubmit() {

    if (this.myForm.invalid) {
      this.errorMsg = "Completa todos los campos correctamente.";
      return;
    }
    
    const username = this.myForm.value.usuario;
    const password = this.myForm.value.password;

    this.errorMsg = "";
    this.loading = true;

    console.log("📤 Enviando al backend:", { username, password });

    this.loginService.login(username, password).subscribe({
      next: (resp) => {
        this.loading = false;
        console.log("📥 RESPUESTA EXACTA DEL BACKEND:", resp);

        if (!resp) {
          console.log("❌ ERROR: La respuesta llegó vacía.");
          this.errorMsg = "El servidor respondió vacío.";
          return;
        }

        if (resp.success === true) {

          // 🔥 GUARDAR TOKEN Y USER_ID
          localStorage.setItem("token", resp.token);
          localStorage.setItem("user_id", resp.userId.toString());
          localStorage.setItem("username", resp.username);
          console.log("TOKEN GUARDADO:", resp.token);
          console.log("USER_ID GUARDADO:", resp.userId);
          console.log("✅ LOGIN CORRECTO. Redirigiendo...");
          this.router.navigate(['/home']);
        } else {
          console.log("⚠️ Credenciales incorrectas:", resp);
          this.errorMsg = resp.message || "Usuario o contraseña incorrectos";
        }
      },

      error: (err) => {
        this.loading = false;
        console.log("❌ ERROR COMPLETO EN LA PETICIÓN:", err);

        // ------------ TIPOS DE ERRORES ------------
        if (err.status === 0) {
          console.log("🛑 ERROR 0: No se puede conectar al backend");
          this.errorMsg = "No se pudo conectar con el servidor. Verifica que la API esté activa.";
          return;
        }

        if (err.status === 401) {
          this.errorMsg = "Usuario o contraseña incorrectos";
          return;
        }

        if (err.status === 500) {
          this.errorMsg = "Error interno en el servidor";
          return;
        }

        // fallback
        this.errorMsg = "Ocurrió un error inesperado.";
      }
    });
  }
}
