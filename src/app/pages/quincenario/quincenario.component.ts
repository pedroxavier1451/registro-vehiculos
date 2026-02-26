import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-quincenario',
  templateUrl: './quincenario.component.html',
  styleUrls: ['./quincenario.component.scss']
})
export class QuincenarioComponent implements OnInit {
  fechaSeleccionada: Date | null = null;
  horaSeleccionada: string | null = null;
  horariosDisponibles: string[] = [];
  horariosOcupados: Set<string> = new Set();
  cargandoHorarios: boolean = false;
  minDate: Date = new Date();

  // Nuevos campos solicitados
  celebrante: string = '';
  traerPeregrinacion: boolean = false;
  detallePeregrinacion: string = '';
  traeCoro: boolean = false;
  detalleCoro: string = '';
  provincia: string = '';
  parroquia: string = '';

  // Configuración en español para el calendario
  es: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private firebaseService: FirebaseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.generarHorariosDisponibles();
    this.configurarLocaleEspanol();
    this.primengConfig.setTranslation(this.es);
  }

  configurarLocaleEspanol() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  generarHorariosDisponibles() {
    // Generar horarios de 8:00 AM a 6:00 PM en intervalos de 1 hora
    for (let hora = 8; hora <= 18; hora++) {
      const horaFormateada = hora.toString().padStart(2, '0');
      this.horariosDisponibles.push(`${horaFormateada}:00`);
    }
  }

  async onFechaSeleccionada(fecha: any) {
    this.fechaSeleccionada = fecha;
    this.horaSeleccionada = null; // Reset hora cuando cambia la fecha
    this.horariosOcupados.clear();
    this.cargandoHorarios = true;
    
    // Cargar reservas existentes para esta fecha
    try {
      const reservas = await this.firebaseService.obtenerReservasPorFecha(fecha);
      reservas.forEach(reserva => {
        if (reserva.hora) {
          this.horariosOcupados.add(reserva.hora);
        }
      });
    } catch (error) {
      console.error('Error cargando reservas existentes:', error);
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'No se pudieron cargar las reservas existentes' 
      });
    } finally {
      this.cargandoHorarios = false;
    }
  }

  onHoraSeleccionada(hora: string) {
    this.horaSeleccionada = hora;
  }

  isHorarioOcupado(hora: string): boolean {
    return this.horariosOcupados.has(hora);
  }

  get reservaCompleta(): boolean {
    return this.fechaSeleccionada !== null && this.horaSeleccionada !== null;
  }

  confirmarReserva() {
    if (this.reservaCompleta && this.fechaSeleccionada && this.horaSeleccionada) {
      // Preparar payload con los nuevos campos
      const reservaPayload: any = {
        fecha: this.fechaSeleccionada,
        hora: this.horaSeleccionada,
        celebrante: this.celebrante || null,
        peregrinacion: this.traerPeregrinacion && this.detallePeregrinacion ? this.detallePeregrinacion : null,
        coro: this.traeCoro && this.detalleCoro ? this.detalleCoro : null,
        provincia: this.provincia || null,
        parroquia: this.parroquia || null,
      };

      // Guardar en Firebase
      this.firebaseService.registrarReserva(reservaPayload)
        .then(id => {
          this.messageService.add({ severity: 'success', summary: 'Reserva', detail: 'Reserva guardada correctamente' });
          console.log('Reserva confirmada:', { id, ...reservaPayload });
          // Resetear selección y campos
          this.fechaSeleccionada = null;
          this.horaSeleccionada = null;
          this.celebrante = '';
          this.traerPeregrinacion = false;
          this.detallePeregrinacion = '';
          this.traeCoro = false;
          this.detalleCoro = '';
          this.provincia = '';
          this.parroquia = '';
          this.horariosDisponibles = [];
          this.horariosOcupados.clear();
          this.generarHorariosDisponibles();
        })
        .catch(err => {
          console.error('Error al guardar reserva:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la reserva' });
        });
    }
  }
}
