import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarModule, DropdownModule, InputTextModule, ButtonModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registroForm: FormGroup;

  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'other' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // VALIDACIÓN DE COINCIDENCIA
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    if (this.registroForm.hasError('mismatch')) {
      alert('Las contraseñas no coinciden');
      return;
    }

      const fechaISO = this.registroForm.value.fechaNacimiento.toISOString().split("T")[0];

    const data = {
      Username: this.registroForm.value.email,
      Password: this.registroForm.value.password,
      Nombre: this.registroForm.value.nombre,
      Apellido: this.registroForm.value.apellido,
      FechaNacimiento: this.registroForm.value.fechaNacimiento.toISOString().split('T')[0],
      Genero: this.registroForm.value.genero
    };
    
    console.log("📤 DATA A ENVIAR AL BACKEND:", data);


    this.loginService.register(data).subscribe({
      next: (res) => {
        alert(res.message || "Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error al registrar usuario: ' + (err.error || err.message));
      }
    });
  }
}

