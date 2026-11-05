import { Component } from '@angular/core';

@Component({
  selector: 'app-pase-info',
  templateUrl: './pase-info.component.html',
  styleUrls: ['./pase-info.component.scss']
})
export class PaseInfoComponent {
  // Tarjetas informativas principales
  tarjetas = [
    {
      icono: 'pi pi-star',
      titulo: '¿Qué es?',
      texto: 'Una manifestación de fe y tradición cuencana en honor al Niño Jesús.'
    },
    {
      icono: 'pi pi-users',
      titulo: 'Participación',
      texto: 'Pueden participar familias, parroquias, instituciones educativas, barrios y grupos de devoción.'
    },
    {
      icono: 'pi pi-map-marker',
      titulo: 'Recorrido',
      texto: 'Un desfile por las principales calles de la ciudad, que comparte fe, alegría y expresión cultural.'
    },
    {
      icono: 'pi pi-shield',
      titulo: 'Recomendaciones',
      texto: 'Asiste con espíritu de respeto, mantén el orden y cuida el ambiente de oración y celebración.'
    }
  ];
}
