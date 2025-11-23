import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  title = 'biblioteca';

  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }

  // 🔹 Método nuevo para ocultar el header en login, register y landing
  isHiddenHeader(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register') || url === '/' || url.includes('/landing');
  }
}
