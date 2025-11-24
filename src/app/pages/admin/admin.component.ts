import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  vehiculos: any[] = [];
  loading = false;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      // No autorizado, enviar a login secreto
      this.router.navigate(['/admin']);
      return;
    }

    await this.loadVehiculos();
  }

  async loadVehiculos(): Promise<void> {
    this.loading = true;
    try {
      this.vehiculos = await this.firebaseService.obtenerVehiculos();
    } catch (e) {
      console.error(e);
      alert('Error cargando registros');
    } finally {
      this.loading = false;
    }
  }

  async eliminar(id: string): Promise<void> {
    const ok = confirm('¿Eliminar este registro?');
    if (!ok) return;

    try {
      await this.firebaseService.eliminarVehiculo(id);
      // refrescar lista
      await this.loadVehiculos();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  }

  irAValidacion(): void {
    this.router.navigate(['/admin/validacion']);
  }

  logout(): void {
    sessionStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }
}
