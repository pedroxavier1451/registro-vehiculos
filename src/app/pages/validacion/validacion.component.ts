import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { BarcodeFormat } from '@zxing/library';

interface ResultadoValidacion {
  valido: boolean;
  titulo: string;
  mensaje: string;
  datos?: any;
}

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit, OnDestroy {
  // Modo de escaneo
  modoEscaneo: 'camara' | 'manual' = 'camara';
  
  // Propiedades para entrada manual
  codigoQR: string = '';
  
  // Propiedades para cámara
  camaraActiva: boolean = false;
  camaraIniciada: boolean = false;
  camaraSeleccionada: MediaDeviceInfo | undefined = undefined;
  camarasDisponibles: MediaDeviceInfo[] = [];
  errorCamara: string = '';
  formatosPermitidos: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  
  // Propiedades comunes
  validando: boolean = false;
  resultado: ResultadoValidacion | null = null;
  historial: any[] = [];
  mostrarModal: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que sea admin
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      this.router.navigate(['/admin']);
      return;
    }

    // Obtener nombre del usuario administrador
    this.nombreUsuario = sessionStorage.getItem('adminUser') || 'Admin';
    console.log('Usuario administrador:', this.nombreUsuario);

    // Iniciar cámara por defecto
    this.iniciarCamara();
  }

  async validarCodigo(): Promise<void> {
    if (!this.codigoQR.trim()) {
      return;
    }

    this.validando = true;
    this.resultado = null;

    try {
      // El código QR tiene formato: token|docId
      const partes = this.codigoQR.trim().split('|');
      
      if (partes.length !== 2) {
        this.mostrarError('Código QR inválido', 'El formato del código no es correcto');
        return;
      }

      const [qrToken, docId] = partes;

      // Buscar el documento en Firestore
      const vehiculo = await this.firebaseService.obtenerVehiculoPorId(docId);

      if (!vehiculo) {
        this.mostrarError('Código no encontrado', 'No existe un registro con este código QR');
        return;
      }

      // Verificar que el token coincida
      if (vehiculo.qrToken !== qrToken) {
        this.mostrarError('Código inválido', 'El código QR no coincide con el registro');
        return;
      }

      // Verificar si ya fue validado
      if (vehiculo.validado) {
        const fechaValidacion = vehiculo.validadoAt?.toDate();
        this.mostrarAdvertencia(
          'Código ya validado',
          `Este código ya fue utilizado el ${fechaValidacion ? fechaValidacion.toLocaleString() : 'anteriormente'}`,
          vehiculo
        );
        return;
      }

      // Validar el código
      console.log('Validando con usuario:', this.nombreUsuario);
      await this.firebaseService.validarQR(docId, this.nombreUsuario);

      this.mostrarExito('✅ Código Válido', 'Acceso autorizado. Bienvenido al evento!', vehiculo);

      // Mostrar modal y limpiar
      this.mostrarModal = true;
      this.codigoQR = '';

    } catch (error) {
      console.error('Error validando código:', error);
      this.mostrarError('Error del sistema', 'Ocurrió un error al validar el código. Intenta nuevamente.');
    } finally {
      this.validando = false;
    }
  }

  mostrarExito(titulo: string, mensaje: string, datos: any): void {
    this.resultado = { valido: true, titulo, mensaje, datos };
    this.agregarAlHistorial(true, mensaje, datos);
  }

  mostrarAdvertencia(titulo: string, mensaje: string, datos: any): void {
    this.resultado = { valido: false, titulo, mensaje, datos };
    this.agregarAlHistorial(false, mensaje, datos);
    this.mostrarModal = true;
  }

  mostrarError(titulo: string, mensaje: string): void {
    this.resultado = { valido: false, titulo, mensaje };
    this.agregarAlHistorial(false, mensaje);
    this.mostrarModal = true;
  }

  agregarAlHistorial(valido: boolean, mensaje: string, datos?: any): void {
    this.historial.unshift({
      valido,
      mensaje,
      datos,
      hora: new Date()
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.resultado = null;
    this.codigoQR = '';
    
    // Si está en modo cámara, reiniciar para permitir nuevo escaneo
    if (this.modoEscaneo === 'camara') {
      this.validando = false;
    }
  }

  // Métodos para cámara
  cambiarModo(modo: 'camara' | 'manual'): void {
    this.modoEscaneo = modo;
    this.resultado = null;
    this.codigoQR = '';
    
    if (modo === 'camara') {
      this.iniciarCamara();
    } else {
      this.detenerCamara();
    }
  }

  iniciarCamara(): void {
    this.camaraActiva = true;
    this.errorCamara = '';
  }

  detenerCamara(): void {
    this.camaraActiva = false;
    this.camaraIniciada = false;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.camarasDisponibles = devices;
    this.camaraIniciada = true;
    
    // Seleccionar la primera cámara disponible
    if (devices.length > 0 && !this.camaraSeleccionada) {
      // Preferir cámara trasera en móviles
      const camaraTrasera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      this.camaraSeleccionada = camaraTrasera || devices[0];
    }
  }

  onPermissionResponse(hasPermission: boolean): void {
    if (!hasPermission) {
      this.errorCamara = 'No se otorgaron permisos para acceder a la cámara. Por favor, permite el acceso en la configuración del navegador.';
      this.camaraActiva = false;
    }
  }

  onScanSuccess(result: string): void {
    if (this.validando || this.mostrarModal) {
      return; // Evitar escaneos múltiples mientras se valida o modal está abierto
    }
    
    // Asignar el código escaneado y validar
    this.codigoQR = result;
    this.validarCodigo();
  }

  cambiarCamara(): void {
    // El cambio se maneja automáticamente por el binding [(ngModel)]
  }

  reiniciarCamara(): void {
    this.errorCamara = '';
    this.camaraActiva = false;
    setTimeout(() => {
      this.iniciarCamara();
    }, 100);
  }

  ngOnDestroy(): void {
    this.detenerCamara();
  }

  volver(): void {
    this.router.navigate(['/admin/panel']);
  }
}
