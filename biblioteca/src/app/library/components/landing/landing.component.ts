import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
