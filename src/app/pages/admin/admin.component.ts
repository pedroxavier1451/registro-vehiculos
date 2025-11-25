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
  vehiculosFiltrados: any[] = [];
  busquedaCedula: string = '';
  loading = false;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Verificar autenticación completa
    if (!this.verificarAutenticacion()) {
      console.warn('Acceso no autorizado al panel de administración');
      this.router.navigate(['/admin']);
      return;
    }

    await this.loadVehiculos();
  }

  private verificarAutenticacion(): boolean {
    const isAdmin = sessionStorage.getItem('isAdmin');
    const authToken = sessionStorage.getItem('authToken');
    const tokenTimestamp = sessionStorage.getItem('tokenTimestamp');
    const adminUser = sessionStorage.getItem('adminUser');

    // Verificar que todos los datos existan
    if (!isAdmin || !authToken || !tokenTimestamp || !adminUser) {
      return false;
    }

    // Verificar que el token no haya expirado (24 horas)
    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    
    if (tokenAge > maxAge) {
      console.warn('Token expirado');
      this.logout();
      return false;
    }

    // Verificar que el token sea válido
    if (!this.validarToken(authToken, adminUser, tokenTimestamp)) {
      console.warn('Token inválido');
      this.logout();
      return false;
    }

    return true;
  }

  private validarToken(token: string, username: string, timestamp: string): boolean {
    try {
      const secretKey = 'registro-vehiculos-2025-secret';
      const expectedData = `${username}-${timestamp}-${secretKey}`;
      const expectedToken = btoa(expectedData);
      
      return token === expectedToken;
    } catch (e) {
      return false;
    }
  }

  async loadVehiculos(): Promise<void> {
    this.loading = true;
    try {
      this.vehiculos = await this.firebaseService.obtenerVehiculos();
      this.vehiculosFiltrados = [...this.vehiculos];
    } catch (e) {
      console.error(e);
      alert('Error cargando registros');
    } finally {
      this.loading = false;
    }
  }

  filtrarVehiculos(): void {
    if (!this.busquedaCedula.trim()) {
      this.vehiculosFiltrados = [...this.vehiculos];
      return;
    }

    const busqueda = this.busquedaCedula.trim().toLowerCase();
    this.vehiculosFiltrados = this.vehiculos.filter(v => 
      v.documentoIdentificacion?.toLowerCase().includes(busqueda)
    );
  }

  limpiarBusqueda(): void {
    this.busquedaCedula = '';
    this.vehiculosFiltrados = [...this.vehiculos];
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
    // Limpiar toda la sesión
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('tokenTimestamp');
    console.log('Sesión cerrada');
    this.router.navigate(['/']);
  }
}
