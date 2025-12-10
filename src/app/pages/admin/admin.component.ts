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
    const adminUser = sessionStorage.getItem('adminUser');

    // Verificar que el usuario administrador exista en sesión
    if (!isAdmin || !adminUser) {
      return false;
    }

    return true;
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

  exportarCSV(): void {
    if (!this.vehiculosFiltrados || !this.vehiculosFiltrados.length) {
      alert('No hay registros para exportar');
      return;
    }

    const headers = [
      'Nombre Completo',
      'Nombre del Grupo',
      'Documento',
      'Teléfono',
      'Email',
      'Temática',
      'Tipo Vehículo',
      'Placa',
      'Fecha Registro',
      'Validado',
      'Fecha Validación',
      'Validado Por'
    ];

    const rows = this.vehiculosFiltrados.map(v => [
      v.nombreCompleto || '',
      v.nombreGrupo || '',
      v.documentoIdentificacion || '',
      v.telefono || '',
      v.email || '',
      v.tematica || '',
      v.tipoVehiculo || '',
      v.placa || '',
      this.formatDate(v.fechaRegistro),
      v.validado ? 'Validado' : 'Pendiente',
      this.formatDate(v.validadoAt),
      v.validadoPor || ''
    ]);

    const escapeCell = (value: any) => {
      const s = value === null || value === undefined ? '' : String(value);
      return '"' + s.replace(/"/g, '""') + '"';
    };

    const csvContent = [
      headers.map(h => escapeCell(h)).join(';'),
      ...rows.map(r => r.map(c => escapeCell(c)).join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.download = `vehiculos_${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private formatDate(field: any): string {
    if (!field) return '';
    try {
      if (field.toDate && typeof field.toDate === 'function') {
        const d: Date = field.toDate();
        return d.toLocaleString();
      }
      if (field instanceof Date) return field.toLocaleString();
      return String(field);
    } catch (e) {
      return '';
    }
  }

  irAValidacion(): void {
    this.router.navigate(['/admin/validacion']);
  }

  logout(): void {
    // Limpiar toda la sesión
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminUser');
    console.log('Sesión cerrada');
    this.router.navigate(['/']);
  }
}
