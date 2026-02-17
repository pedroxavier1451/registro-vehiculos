import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MENU_USER } from './constants/menu.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // AppComponent hosts the global menu; main form logic moved to FormularioPaseComponent
  menuItems: MenuItem[] = MENU_USER;

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
