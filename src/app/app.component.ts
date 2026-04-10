import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './Components/Tapestry/Toast/toast.component';
import { NavComponent } from './Components/Tapestry/Navigation/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToastComponent, NavComponent],
})
export class AppComponent {}
