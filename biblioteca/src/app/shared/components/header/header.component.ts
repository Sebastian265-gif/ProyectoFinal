import { CommonModule } from '@angular/common';
import { Component, OnInit,HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, ImageModule,CommonModule,TieredMenuModule,ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
items: MenuItem[] | undefined;
  constructor(private router: Router) { }

  menuVisible: boolean = false;

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      if (event.target.innerWidth > 900) {
        this.menuVisible = false; // Oculta menú tipo mobile al maximizar
      }
    }

  toggleMenu() {
  this.menuVisible = !this.menuVisible;
  }

  onItemClick(item: any) {
    if (item.command) item.command();
    this.menuVisible = false; // Cierra menú en mobile
  }



  ngOnInit(): void {
      this.items = [
        {
          label: 'Inicio',
          icon: 'pi pi-home',
          route: '/home'
        },
        {
          label: 'Agregar Libro',
          icon: 'pi pi-plus',
          route: '/addbook'
        },
        {
          label: 'Buscar libro',
          icon: 'pi pi-search',
          route: '/searchBook'
        },
        {
          label: 'Editar libro',
          icon: 'pi pi-pencil',
          route: '/updatebook'
        },

         {
          label: 'Comunidad',
          icon: 'pi pi-trash',
          route: '/community'
        },

        {
          label: 'Eliminar libro',
          icon: 'pi pi-trash',
          route: '/deletebook'
        },
  
        {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

        logout() {
           localStorage.clear();
            this.router.navigate(['/login']);
  }
      
}

