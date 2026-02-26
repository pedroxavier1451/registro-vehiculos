import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

interface Reserva {
  id: string;
  fecha: Date | null;
  hora: string | null;
  createdAt?: Date | null;
}

@Component({
  selector: 'app-lista-quincenario',
  templateUrl: './lista-quincenario.component.html',
  styleUrls: ['./lista-quincenario.component.scss']
})
export class ListaQuincenarioComponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.cargarReservas();
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

}
