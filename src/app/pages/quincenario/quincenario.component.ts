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
  // Selección simple de un rango horario
  horaSeleccionada: string | null = null;
  horariosDisponibles: string[] = [];
  horariosOcupados: Set<string> = new Set();
  cargandoHorarios: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  // Nuevos campos solicitados
  celebrante: string = '';
  celebranteError: string = '';
  telefono: string = '';
  telefonoError: string = '';
  traerPeregrinacion: boolean = false;
  detallePeregrinacion: string = '';
  traeCoro: boolean = false;
  detalleCoro: string = '';
  provincia: string = '';
  provinciaError: string = '';
  parroquia: string = '';
  parroquiaError: string = '';

  // Configuración en español para el calendario
  es: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private firebaseService: FirebaseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.configurarRangoJulio();
    // Por defecto, posicionar el selector en el 1 de julio
    this.fechaSeleccionada = this.minDate;
    this.generarHorariosDisponibles();
    this.configurarLocaleEspanol();
    this.primengConfig.setTranslation(this.es);
    // Cargar horarios para la fecha por defecto
    this.onFechaSeleccionada(this.fechaSeleccionada);
  }

  configurarRangoJulio() {
    const fixedYear = 2026;
    // Mes 6 = Julio (0-indexed)
    this.minDate = new Date(fixedYear, 6, 1);
    this.maxDate = new Date(fixedYear, 6, 16);
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
    // Generar rangos horarios: cada item es un rango completo
    this.horariosDisponibles = [];
    
    // Primer rango especial: 06:45 - 08:00
    this.horariosDisponibles.push('06:45 - 08:00');
    
    // Rangos de hora en hora desde 08:00 hasta 20:00 (incluye 19:00 - 20:00)
    for (let hora = 8; hora <= 19; hora++) {
      const horaInicio = hora.toString().padStart(2, '0');
      const horaFin = (hora + 1).toString().padStart(2, '0');
      this.horariosDisponibles.push(`${horaInicio}:00 - ${horaFin}:00`);
    }
  }

  async onFechaSeleccionada(fecha: any) {
    this.fechaSeleccionada = fecha;
    this.horaSeleccionada = null; // Reset selección de hora cuando cambia la fecha
    this.horariosOcupados.clear();
    this.cargandoHorarios = true;
    
    // Cargar reservas existentes para esta fecha
    try {
      const reservas = await this.firebaseService.obtenerReservasPorFecha(fecha);
      reservas.forEach(reserva => {
        if (reserva.horas && Array.isArray(reserva.horas)) {
          // Marcar cada hora del array como ocupada
          reserva.horas.forEach((hora: string) => {
            this.horariosOcupados.add(hora);
          });
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

  onHoraSeleccionada(rango: string) {
    // Si el horario está ocupado, mostrar mensaje
    if (this.isHorarioOcupado(rango)) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Horario ocupado', 
        detail: 'Este horario ya está reservado' 
      });
      return;
    }

    // Si se clickea el mismo rango, deseleccionar (toggle)
    if (this.horaSeleccionada === rango) {
      this.horaSeleccionada = null;
      return;
    }

    // Seleccionar el rango
    this.horaSeleccionada = rango;
  }

  isHorarioOcupado(hora: string): boolean {
    return this.horariosOcupados.has(hora);
  }

  get reservaCompleta(): boolean {
    return this.fechaSeleccionada !== null && 
           this.horaSeleccionada !== null &&
           this.celebrante.trim() !== '' &&
           this.telefono.trim() !== '' &&
           this.validarCelularEcuatoriano(this.telefono) &&
           this.provincia.trim() !== '' &&
           this.parroquia.trim() !== '';
  }

  validarCelularEcuatoriano(telefono: string): boolean {
    // Primero validar que no esté vacío
    if (telefono.trim() === '') {
      this.telefonoError = 'El número de teléfono es obligatorio';
      return false;
    }
    
    // Formato: 09 seguido de 8 dígitos (total 10 dígitos)
    const regex = /^09\d{8}$/;
    const esValido = regex.test(telefono);
    
    if (!esValido) {
      this.telefonoError = 'Ingrese un número celular válido (Ej: 0991234567)';
    } else {
      this.telefonoError = '';
    }
    
    return esValido;
  }

  onTelefonoChange() {
    this.validarCelularEcuatoriano(this.telefono);
  }

  validarCelebrante() {
    if (this.celebrante.trim() === '') {
      this.celebranteError = 'El nombre del celebrante es obligatorio';
      return false;
    }
    this.celebranteError = '';
    return true;
  }

  onCelebranteChange() {
    this.validarCelebrante();
  }

  validarProvincia() {
    if (this.provincia.trim() === '') {
      this.provinciaError = 'La provincia es obligatoria';
      return false;
    }
    this.provinciaError = '';
    return true;
  }

  onProvinciaChange() {
    this.validarProvincia();
  }

  validarParroquia() {
    if (this.parroquia.trim() === '') {
      this.parroquiaError = 'La parroquia/comunidad es obligatoria';
      return false;
    }
    this.parroquiaError = '';
    return true;
  }

  onParroquiaChange() {
    this.validarParroquia();
  }

  onPeregrinacionChange() {
    // Limpiar el detalle cuando se desactiva el switch
    if (!this.traerPeregrinacion) {
      this.detallePeregrinacion = '';
    }
  }

  onCoroChange() {
    // Limpiar el detalle cuando se desactiva el switch
    if (!this.traeCoro) {
      this.detalleCoro = '';
    }
  }

  async confirmarReserva() {
    if (!this.reservaCompleta || !this.fechaSeleccionada || !this.horaSeleccionada) return;

    // Validar todos los campos obligatorios
    const celebranteValido = this.validarCelebrante();
    const telefonoValido = this.validarCelularEcuatoriano(this.telefono);
    const provinciaValida = this.validarProvincia();
    const parroquiaValida = this.validarParroquia();

    if (!celebranteValido || !telefonoValido || !provinciaValida || !parroquiaValida) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Campos incompletos', 
        detail: 'Por favor complete todos los campos obligatorios correctamente', 
        life: 4000 
      });
      return;
    }

    try {
      // Verificar si ya existe una reserva con este número de teléfono
      const todasLasReservas = await this.firebaseService.obtenerReservas();
      const telefonoYaRegistrado = todasLasReservas.some(reserva => 
        reserva.telefono === this.telefono
      );

      if (telefonoYaRegistrado) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Teléfono ya registrado', 
          detail: 'Ya existe una reserva con este número de teléfono. Solo se permite una reserva por número.', 
          life: 5000 
        });
        return;
      }

      // Verificar si ya existe una reserva con esta fecha y hora
      const reservasExistentes = await this.firebaseService.obtenerReservasPorFecha(this.fechaSeleccionada);
      const horaYaRegistrada = reservasExistentes.some(reserva => 
        reserva.horas && Array.isArray(reserva.horas) && reserva.horas.includes(this.horaSeleccionada!)
      );

      if (horaYaRegistrada) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hora ya registrada', 
          detail: 'Esta hora ya está registrada. La página se recargará para actualizar.', 
          life: 3000 
        });
        // Recargar la página después de 3 segundos
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      // Si no está registrada, proceder con el registro
      const reservaPayload: any = {
        fecha: this.fechaSeleccionada,
        horas: [this.horaSeleccionada], // Enviar como array
        celebrante: this.celebrante,
        telefono: this.telefono,
        provincia: this.provincia,
        parroquia: this.parroquia,
        peregrinacion: this.traerPeregrinacion && this.detallePeregrinacion ? this.detallePeregrinacion : null,
        coro: this.traeCoro && this.detalleCoro ? this.detalleCoro : null,
      };

      // Guardar en Firebase
      const id = await this.firebaseService.registrarReserva(reservaPayload);
      this.messageService.add({ severity: 'success', summary: 'Reserva', detail: 'Reserva guardada correctamente' });
      console.log('Reserva confirmada:', { id, ...reservaPayload });
      
      // Resetear selección y campos
      this.fechaSeleccionada = this.minDate;
      this.horaSeleccionada = null;
      this.celebrante = '';
      this.telefono = '';
      this.traerPeregrinacion = false;
      this.detallePeregrinacion = '';
      this.traeCoro = false;
      this.detalleCoro = '';
      this.provincia = '';
      this.parroquia = '';
      this.horariosDisponibles = [];
      this.horariosOcupados.clear();
      this.generarHorariosDisponibles();
      
      // Recargar horarios para el 1 de julio
      await this.onFechaSeleccionada(this.fechaSeleccionada);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la reserva' });
    }
  }
}
