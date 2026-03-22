import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { FirebaseService } from '../../services/firebase.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-quincenario',
  templateUrl: './quincenario.component.html',
  styleUrls: ['./quincenario.component.scss']
})
export class QuincenarioComponent implements OnInit, AfterViewInit {
  fechaSeleccionada: Date | null = null;
  // Selección simple de un rango horario
  horaSeleccionada: string | null = null;
  horariosDisponibles: string[] = [];
  horariosOcupados: Set<string> = new Set();
  cargandoHorarios: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  todasLasFechasLlenas: boolean = false;
  diasCompletamenteLlenos: Set<string> = new Set(); // Almacena fechas completamente llenas
  diaSeleccionadoLleno: boolean = false; // Indica si el día seleccionado está completamente lleno

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

  // Lista de provincias del Ecuador
  provincias = [
    { label: 'Azuay', value: 'Azuay' },
    { label: 'Bolívar', value: 'Bolívar' },
    { label: 'Cañar', value: 'Cañar' },
    { label: 'Carchi', value: 'Carchi' },
    { label: 'Chimborazo', value: 'Chimborazo' },
    { label: 'Cotopaxi', value: 'Cotopaxi' },
    { label: 'El Oro', value: 'El Oro' },
    { label: 'Esmeraldas', value: 'Esmeraldas' },
    { label: 'Galápagos', value: 'Galápagos' },
    { label: 'Guayas', value: 'Guayas' },
    { label: 'Imbabura', value: 'Imbabura' },
    { label: 'Loja', value: 'Loja' },
    { label: 'Los Ríos', value: 'Los Ríos' },
    { label: 'Manabí', value: 'Manabí' },
    { label: 'Morona Santiago', value: 'Morona Santiago' },
    { label: 'Napo', value: 'Napo' },
    { label: 'Orellana', value: 'Orellana' },
    { label: 'Pastaza', value: 'Pastaza' },
    { label: 'Pichincha', value: 'Pichincha' },
    { label: 'Santa Elena', value: 'Santa Elena' },
    { label: 'Santo Domingo de los Tsáchilas', value: 'Santo Domingo de los Tsáchilas' },
    { label: 'Sucumbíos', value: 'Sucumbíos' },
    { label: 'Tungurahua', value: 'Tungurahua' },
    { label: 'Zamora Chinchipe', value: 'Zamora Chinchipe' },
    { label: 'Otro', value: 'Otro' }
  ];

  // Configuración en español para el calendario
  es: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private firebaseService: FirebaseService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
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
    // Verificar si todas las fechas están llenas
    this.verificarTodasLasFechasLlenas();
  }

  ngAfterViewInit() {
    // Colorear los días llenos en el calendario después de que se renderiza
    setTimeout(() => this.colorearDiasLlenosEnCalendario(), 100);
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

  async verificarTodasLasFechasLlenas() {
    try {
      const todasLasReservas = await this.firebaseService.obtenerReservas();
      
      // Limpiar Set de días completamente llenos
      this.diasCompletamenteLlenos.clear();
      
      // Mapa para contar horas por día
      const horasPorDia = new Map<string, Set<string>>();
      
      // Procesar todas las reservas
      todasLasReservas.forEach(reserva => {
        if (reserva.fecha && reserva.horas && Array.isArray(reserva.horas)) {
          const fecha = new Date(reserva.fecha);
          const fechaStr = fecha.toDateString();
          
          if (!horasPorDia.has(fechaStr)) {
            horasPorDia.set(fechaStr, new Set());
          }
          
          // Agregar todas las horas de esta reserva
          reserva.horas.forEach((hora: string) => {
            horasPorDia.get(fechaStr)!.add(hora);
          });
        }
      });
      
      // Determinar cuáles días están completamente llenos (todos los 13 horarios ocupados)
      let fechasCompletamenteLlenas = 0;
      for (let dia = 1; dia <= 16; dia++) {
        const fecha = new Date(2026, 6, dia);
        const fechaStr = fecha.toDateString();
        const horasEnEsteDia = horasPorDia.get(fechaStr)?.size || 0;
        
        // Si tiene los 13 horarios ocupados, marcar como completamente lleno
        if (horasEnEsteDia === this.horariosDisponibles.length) {
          this.diasCompletamenteLlenos.add(fechaStr);
          fechasCompletamenteLlenas++;
        }
      }
      
      // Si todas las 16 fechas están completamente llenas, poner el calendario en rojo
      this.todasLasFechasLlenas = fechasCompletamenteLlenas === 16;
      
      // Colorear los días llenos en el calendario
      this.colorearDiasLlenosEnCalendario();
    } catch (error) {
      console.error('Error verificando fechas llenas:', error);
    }
  }

  async onFechaSeleccionada(fecha: any) {
    this.fechaSeleccionada = fecha;
    this.horaSeleccionada = null; // Reset selección de hora cuando cambia la fecha
    this.horariosOcupados.clear();
    this.cargandoHorarios = true;
    
    // Verificar si el día seleccionado está completamente lleno
    if (fecha) {
      const fechaStr = fecha.toDateString();
      this.diaSeleccionadoLleno = this.diasCompletamenteLlenos.has(fechaStr);
    } else {
      this.diaSeleccionadoLleno = false;
    }
    
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
      // Colorear los días llenos después de cargar los horarios
      setTimeout(() => this.colorearDiasLlenosEnCalendario(), 50);
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

  // Control del modal de resumen
  showResumenModal: boolean = false;

  abrirResumenModal() {
    if (!this.reservaCompleta || !this.fechaSeleccionada || !this.horaSeleccionada) return;

    // Validaciones de campos
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

    // Validaciones de disponibilidad en la BD
    this.validarDisponibilidadYAbrirModal();
  }

  async validarDisponibilidadYAbrirModal() {
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
      if (!this.fechaSeleccionada) return;
      
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

      // Si todo es válido, abrir el modal
      this.showResumenModal = true;
    } catch (error) {
      console.error('Error validando disponibilidad:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo validar la disponibilidad. Intente de nuevo.', 
        life: 4000 
      });
    }
  }

  cerrarResumenModal() {
    this.showResumenModal = false;
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

    try {
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
      
      // Generar PDF con la reserva
      this.generarPDFReserva();
      
      this.messageService.add({ 
        severity: 'success', 
        summary: '✓ Reserva Registrada', 
        detail: 'Tu reserva se ha guardado correctamente y se ha descargado tu comprobante en PDF' 
      });
      console.log('Reserva confirmada:', { id, ...reservaPayload });
      
      // Cerrar el modal
      this.cerrarResumenModal();
      
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
      
      // Verificar si todas las fechas están llenas
      await this.verificarTodasLasFechasLlenas();
    } catch (err) {
      console.error('Error al guardar reserva:', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la reserva' });
    }
  }

  generarPDFReserva() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 30;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 80, 150);
    doc.text('COMPROBANTE DE RESERVA', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.setDrawColor(40, 80, 150);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 15;

    // Contenido
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Datos de la reserva
    const contenido = [
      { label: 'Fecha de Reserva:', value: this.fechaSeleccionada ? new Date(this.fechaSeleccionada).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-' },
      { label: 'Hora:', value: this.horaSeleccionada || '-' },
      { label: 'Celebrante:', value: this.celebrante || '-' },
      { label: 'Teléfono:', value: this.telefono || '-' },
      { label: 'Provincia:', value: this.provincia || '-' },
      { label: 'Parroquia/Comunidad:', value: this.parroquia || '-' },
      ...(this.traerPeregrinacion && this.detallePeregrinacion ? [{ label: 'Peregrinación:', value: this.detallePeregrinacion }] : []),
      ...(this.traeCoro && this.detalleCoro ? [{ label: 'Coro:', value: this.detalleCoro }] : []),
    ];

    contenido.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, margin, yPos);
      
      doc.setFont('helvetica', 'normal');
      const textoWrapped = doc.splitTextToSize(item.value, pageWidth - margin * 2 - 60);
      doc.text(textoWrapped, margin + 60, yPos);
      
      yPos += 8;
    });

    yPos += 15;

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.setDrawColor(40, 80, 150);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 15;

    // Pie de página
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const fechaGeneracion = new Date().toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    doc.text(`Generado el: ${fechaGeneracion}`, pageWidth / 2, pageWidth - 10, { align: 'center' });

    // Guardar PDF
    const nombreArchivo = `Reserva_Quincenario_${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);
  }

  colorearDiasLlenosEnCalendario() {
    try {
      // Encontrar el calendario en el DOM
      const calendarElement = document.querySelector('.p-datepicker-calendar');
      if (!calendarElement) return;
      
      // Encontrar todos los td en el calendario
      const dayCells = calendarElement.querySelectorAll('tbody tr td');
      
      dayCells.forEach(cell => {
        const span = cell.querySelector('span');
        if (!span) return;
        
        const dayText = span.textContent?.trim();
        if (!dayText) return;
        
        const dayNumber = parseInt(dayText);
        
        // Solo procesar días del 1 al 16 de julio
        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 16) return;
        
        // Verificar si este td es parte de otro mes (tiene clase p-datepicker-other-month)
        if (cell.classList.contains('p-datepicker-other-month')) return;
        
        // Crear una fecha para este día
        const fecha = new Date(2026, 6, dayNumber);
        const fechaStr = fecha.toDateString();
        
        // Si este día está completamente lleno, añadir clase
        if (this.diasCompletamenteLlenos.has(fechaStr)) {
          (span as HTMLElement).classList.add('dia-lleno-calendario');
        } else {
          (span as HTMLElement).classList.remove('dia-lleno-calendario');
        }
      });
    } catch (error) {
      console.error('Error coloreando días en calendario:', error);
    }
  }
}
