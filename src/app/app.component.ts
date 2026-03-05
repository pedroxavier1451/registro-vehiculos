import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MENU_USER } from './constants/menu.constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // AppComponent hosts the global menu; main form logic moved to FormularioPaseComponent
  menuItems: MenuItem[] = MENU_USER;
  showHeaderFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar la ruta inicial
    this.checkRoute(this.router.url);

    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    // Ocultar header y footer en rutas de administración y quincenario
    const adminRoutes = ['/admin', '/admin/panel', '/admin/validacion', '/quincenario'];
    this.showHeaderFooter = !adminRoutes.some(route => url.startsWith(route));
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
