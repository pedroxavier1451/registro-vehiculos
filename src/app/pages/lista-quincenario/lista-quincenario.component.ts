import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import jsPDF from 'jspdf';

interface Reserva {
  id: string;
  fecha: Date | null;
  horas: string[]; // Array de horas seleccionadas
  celebrante?: string | null;
  telefono?: string | null;
  provincia?: string | null;
  parroquia?: string | null;
  peregrinacion?: string | null;
  coro?: string | null;
  createdAt?: Date | null;
}

@Component({
  selector: 'app-lista-quincenario',
  templateUrl: './lista-quincenario.component.html',
  styleUrls: ['./lista-quincenario.component.scss']
})
export class ListaQuincenarioComponent implements OnInit {
  reservas: Reserva[] = [];
  mostrarModalEdicion: boolean = false;
  reservaEditando: Reserva | null = null;
  
  // Campos del formulario de edición
  editFecha: Date | null = null;
  editHorasSeleccionadas: string[] = []; // Puede tener 1 o 2 horas
  editCelebrante: string = '';
  editTelefono: string = '';
  editProvincia: string = '';
  editParroquia: string = '';
  editTraerPeregrinacion: boolean = false;
  editDetallePeregrinacion: string = '';
  editTraeCoro: boolean = false;
  editDetalleCoro: string = '';
  
  // Configuración de fecha y horarios para edición
  minDate: Date = new Date();
  maxDate: Date = new Date();
  horariosDisponiblesEdit: string[] = [];
  horariosOcupadosEdit: Set<string> = new Set();
  cargandoHorariosEdit: boolean = false;
  es: any;

  constructor(
    private firebaseService: FirebaseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.configurarRangoJulio();
    this.configurarLocaleEspanol();
    this.primengConfig.setTranslation(this.es);
    this.cargarReservas();
  }

  configurarRangoJulio() {
    const fixedYear = 2026;
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
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    };
  }

  generarHorariosDisponiblesEdit() {
    this.horariosDisponiblesEdit = [];
    this.horariosDisponiblesEdit.push('06:45 - 08:00');
    for (let hora = 8; hora <= 19; hora++) {
      const horaInicio = hora.toString().padStart(2, '0');
      const horaFin = (hora + 1).toString().padStart(2, '0');
      this.horariosDisponiblesEdit.push(`${horaInicio}:00 - ${horaFin}:00`);
    }
  }

  onHoraSeleccionadaEdit(hora: string) {
    const index = this.editHorasSeleccionadas.indexOf(hora);
    
    // Si ya está seleccionada, deseleccionar
    if (index > -1) {
      this.editHorasSeleccionadas.splice(index, 1);
      return;
    }
    
    // Si ya hay 2 horas, quitar la más antigua y agregar la nueva
    if (this.editHorasSeleccionadas.length >= 2) {
      this.editHorasSeleccionadas.shift();
    }
    
    // Agregar la nueva hora
    this.editHorasSeleccionadas.push(hora);
  }

  isHoraSeleccionadaEdit(hora: string): boolean {
    return this.editHorasSeleccionadas.includes(hora);
  }

  async onFechaEditadaSeleccionada(fecha: any) {
    this.editFecha = fecha;
    const horasAnteriores = [...this.editHorasSeleccionadas]; // Guardar selección
    this.editHorasSeleccionadas = [];
    this.horariosOcupadosEdit.clear();
    this.cargandoHorariosEdit = true;
    
    try {
      const reservas = await this.firebaseService.obtenerReservasPorFecha(fecha);
      reservas.forEach((r: any) => {
        if (r.horas && Array.isArray(r.horas) && r.id !== this.reservaEditando?.id) {
          r.horas.forEach((hora: string) => {
            this.horariosOcupadosEdit.add(hora);
          });
        }
      });
      
      // Restaurar la selección anterior si es válida
      horasAnteriores.forEach(h => {
        if (this.horariosDisponiblesEdit.includes(h) && !this.horariosOcupadosEdit.has(h)) {
          this.editHorasSeleccionadas.push(h);
        }
      });
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
    } finally {
      this.cargandoHorariosEdit = false;
    }
  }

  isHorarioOcupadoEdit(hora: string): boolean {
    return this.horariosOcupadosEdit.has(hora);
  }

  async cargarReservas() {
    try {
      this.reservas = await this.firebaseService.obtenerReservas();
      // ordenar por fecha/hecha si se desea
      this.reservas.sort((a, b) => {
        const fa = a.fecha ? a.fecha.getTime() : 0;
        const fb = b.fecha ? b.fecha.getTime() : 0;
        return fa - fb;
      });
    } catch (error) {
      console.error('Error cargando reservas:', error);
    }
  }

  eliminarReserva(reserva: Reserva) {
    const fechaStr = reserva.fecha ? new Date(reserva.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
    const horasStr = reserva.horas && reserva.horas.length > 0 ? reserva.horas.join(', ') : '-';
    const mensaje = `Se eliminará la reserva de <strong>${reserva.celebrante || 'Sin nombre'}</strong> para el <strong>${fechaStr}</strong> a las <strong>${horasStr}</strong>.<br><br>Esta acción no se puede deshacer.`;
    
    this.confirmationService.confirm({
      message: mensaje,
      header: '⚠️ Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: async () => {
        try {
          await this.firebaseService.eliminarReserva(reserva.id);
          this.messageService.add({ 
            severity: 'success', 
            summary: '✓ Reserva Eliminada', 
            detail: `La reserva de ${reserva.celebrante} ha sido eliminada correctamente`,
            life: 3000
          });
          // Recargar la lista
          await this.cargarReservas();
        } catch (error) {
          console.error('Error eliminando reserva:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo eliminar la reserva' 
          });
        }
      }
    });
  }

  abrirModalEdicion(reserva: Reserva) {
    this.reservaEditando = reserva;
    this.editFecha = reserva.fecha ? new Date(reserva.fecha) : null;
    this.editHorasSeleccionadas = reserva.horas ? [...reserva.horas] : []; // Copiar array de horas
    this.editCelebrante = reserva.celebrante || '';
    this.editTelefono = reserva.telefono || '';
    this.editProvincia = reserva.provincia || '';
    this.editParroquia = reserva.parroquia || '';
    this.editTraerPeregrinacion = !!reserva.peregrinacion;
    this.editDetallePeregrinacion = reserva.peregrinacion || '';
    this.editTraeCoro = !!reserva.coro;
    this.editDetalleCoro = reserva.coro || '';
    
    this.generarHorariosDisponiblesEdit();
    if (this.editFecha) {
      this.onFechaEditadaSeleccionada(this.editFecha);
    }
    
    this.mostrarModalEdicion = true;
  }

  cerrarModalEdicion() {
    this.mostrarModalEdicion = false;
    this.reservaEditando = null;
    this.editFecha = null;
    this.editHorasSeleccionadas = [];
    this.horariosDisponiblesEdit = [];
    this.horariosOcupadosEdit.clear();
  }

  async guardarEdicion() {
    if (!this.reservaEditando) return;

    // Validar campos obligatorios
    if (!this.editFecha || this.editHorasSeleccionadas.length === 0 || 
        !this.editCelebrante.trim() || !this.editTelefono.trim() || 
        !this.editProvincia.trim() || !this.editParroquia.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completa todos los campos obligatorios',
        life: 3000
      });
      return;
    }

    try {
      const payload = {
        fecha: this.editFecha,
        horas: [...this.editHorasSeleccionadas], // Enviar array de horas
        celebrante: this.editCelebrante,
        telefono: this.editTelefono,
        provincia: this.editProvincia,
        parroquia: this.editParroquia,
        peregrinacion: this.editTraerPeregrinacion && this.editDetallePeregrinacion ? this.editDetallePeregrinacion : null,
        coro: this.editTraeCoro && this.editDetalleCoro ? this.editDetalleCoro : null,
      };

      await this.firebaseService.actualizarReserva(this.reservaEditando.id, payload);
      
      this.messageService.add({
        severity: 'success',
        summary: '✓ Reserva Actualizada',
        detail: 'Los cambios se han guardado correctamente',
        life: 3000
      });

      this.cerrarModalEdicion();
      await this.cargarReservas();
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar la reserva',
        life: 3000
      });
    }
  }

  async generarPDF() {
    // Recargar datos de la base de datos antes de generar el PDF
    await this.cargarReservas();
    
    if (this.reservas.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin reservas',
        detail: 'No hay reservas para generar el PDF',
        life: 3000
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Agrupar reservas por fecha
    const reservasPorFecha = this.agruparReservasPorFecha();
    const fechasOrdenadas = Object.keys(reservasPorFecha).sort();
    
    let primeraPagina = true;
    
    // Generar contenido por cada fecha
    for (const fechaStr of fechasOrdenadas) {
      const reservas = reservasPorFecha[fechaStr];
      
      if (!primeraPagina) {
        doc.addPage();
      }
      primeraPagina = false;
      
      let yPos = 30;
      
      // Título con la fecha (corregir zona horaria)
      const fecha = new Date(fechaStr + 'T12:00:00');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const tituloFecha = fecha.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      }).toUpperCase();
      doc.text(tituloFecha, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 8;
      
      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;
      
      // Ordenar reservas por hora
      const reservasOrdenadas = reservas.sort((a, b) => {
        const horaA = a.horas && a.horas.length > 0 ? a.horas[0] : '';
        const horaB = b.horas && b.horas.length > 0 ? b.horas[0] : '';
        return horaA.localeCompare(horaB);
      });
      
      // Mostrar cada reserva
      for (const reserva of reservasOrdenadas) {
        // Verificar si necesitamos nueva página
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 30;
          // Repetir título de fecha
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`${tituloFecha} (continuación)`, pageWidth / 2, yPos, { align: 'center' });
          yPos += 12;
        }
        
        // CABECERA: Hora(s) en negrita y más grande
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        const horas = reserva.horas && reserva.horas.length > 0 ? reserva.horas.join(', ') : '-';
        doc.text(horas, margin, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        
        // Celebrante
        if (reserva.celebrante) {
          doc.setFont('helvetica', 'bold');
          doc.text('Celebrante:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const textoCelebrante = doc.splitTextToSize(reserva.celebrante, maxWidth - 35);
          doc.text(textoCelebrante, margin + 35, yPos);
          yPos += 5 * textoCelebrante.length;
        }
        
        // Teléfono
        if (reserva.telefono) {
          doc.setFont('helvetica', 'bold');
          doc.text('Teléfono:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(reserva.telefono, margin + 35, yPos);
          yPos += 5;
        }
        
        // Provincia
        if (reserva.provincia) {
          doc.setFont('helvetica', 'bold');
          doc.text('Provincia:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const textoProvincia = doc.splitTextToSize(reserva.provincia, maxWidth - 35);
          doc.text(textoProvincia, margin + 35, yPos);
          yPos += 5 * textoProvincia.length;
        }
        
        // Parroquia
        if (reserva.parroquia) {
          doc.setFont('helvetica', 'bold');
          doc.text('Parroquia:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const textoParroquia = doc.splitTextToSize(reserva.parroquia, maxWidth - 35);
          doc.text(textoParroquia, margin + 35, yPos);
          yPos += 5 * textoParroquia.length;
        }
        
        // Peregrinación
        if (reserva.peregrinacion) {
          doc.setFont('helvetica', 'bold');
          doc.text('Peregrinación:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const textoPeregrinacion = doc.splitTextToSize(reserva.peregrinacion, maxWidth - 35);
          doc.text(textoPeregrinacion, margin + 35, yPos);
          yPos += 5 * textoPeregrinacion.length;
        }
        
        // Coro
        if (reserva.coro) {
          doc.setFont('helvetica', 'bold');
          doc.text('Coro:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const textoCoro = doc.splitTextToSize(reserva.coro, maxWidth - 35);
          doc.text(textoCoro, margin + 35, yPos);
          yPos += 5 * textoCoro.length;
        }
        
        // Fecha de registro
        if (reserva.createdAt) {
          doc.setFont('helvetica', 'bold');
          doc.text('Registrada:', margin + 5, yPos);
          doc.setFont('helvetica', 'normal');
          const fechaRegistro = new Date(reserva.createdAt).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          doc.text(fechaRegistro, margin + 35, yPos);
          yPos += 5;
        }
        
        yPos += 10; // Espacio entre reservas
        
        // Línea separadora entre reservas
        doc.setLineWidth(0.2);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
      }
    }
    
    // Pie de página en todas las páginas
    const totalPaginas = doc.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // Guardar el PDF
    const fechaActual = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    doc.save(`Quincenario_Reservas_${fechaActual}.pdf`);
    
    this.messageService.add({
      severity: 'success',
      summary: 'PDF Generado',
      detail: 'El PDF se ha descargado correctamente',
      life: 3000
    });
  }

  private agruparReservasPorFecha(): { [fecha: string]: Reserva[] } {
    const agrupadas: { [fecha: string]: Reserva[] } = {};
    
    for (const reserva of this.reservas) {
      if (reserva.fecha) {
        const fecha = new Date(reserva.fecha);
        // Usar componentes locales para evitar problemas de zona horaria
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const fechaStr = `${year}-${month}-${day}`;
        
        if (!agrupadas[fechaStr]) {
          agrupadas[fechaStr] = [];
        }
        agrupadas[fechaStr].push(reserva);
      }
    }
    
    return agrupadas;
  }

}
