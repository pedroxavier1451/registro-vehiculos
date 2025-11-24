import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './services/firebase.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Registro de Vehículos';
  vehicleForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  showForm = true;
  private routerSub?: Subscription;

  // Opciones para los dropdowns de PrimeNG
  tematicas: any[] = [];
  tiposVehiculo: string[] = [
    'Automóvil (Sedán)',
    'Hatchback',
    'SUV',
    'Camioneta',
    'Pickup liviana',
    'Crossover',
    'Furgoneta pequeña',
    'Plataforma liviana'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeTematicas();

    // Mostrar u ocultar el formulario según la ruta actual (ocultar para rutas /admin)
    this.showForm = !this.router.url.startsWith('/admin');
    this.routerSub = this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd)
    ).subscribe(() => {
      this.showForm = !this.router.url.startsWith('/admin');
    });
  }

  initializeTematicas(): void {
    this.tematicas = [
      {
        label: 'Temas Bíblicos',
        items: [
          { label: 'La creación', value: 'La creación' },
          { label: 'El jardín del Edén', value: 'El jardín del Edén' },
          { label: 'El Arca de Noé', value: 'El Arca de Noé' },
          { label: 'José interpreta los sueños del Faraón', value: 'José interpreta los sueños del Faraón' },
          { label: 'Moisés salvado de las aguas', value: 'Moisés salvado de las aguas' },
          { label: 'La zarza ardiente', value: 'La zarza ardiente' },
          { label: 'Yahvé envía el maná en el desierto', value: 'Yahvé envía el maná en el desierto' },
          { label: 'Los diez mandamientos', value: 'Los diez mandamientos' },
          { label: 'Los Israelitas llevan el Arca de la Alianza', value: 'Los Israelitas llevan el Arca de la Alianza' },
          { label: 'David y Goliat', value: 'David y Goliat' },
          { label: 'El sacrificio del profeta Elías', value: 'El sacrificio del profeta Elías' },
          { label: 'Elías da de comer a la viuda de Sarepta', value: 'Elías da de comer a la viuda de Sarepta' },
          { label: 'Elías ora para que venga la lluvia', value: 'Elías ora para que venga la lluvia' },
          { label: 'Anuncio del nacimiento de Juan el Bautista', value: 'Anuncio del nacimiento de Juan el Bautista' },
          { label: 'Los padres (Joaquín y Ana) de la Virgen María', value: 'Los padres (Joaquín y Ana) de la Virgen María' },
          { label: 'La niña María', value: 'La niña María' },
          { label: 'La anunciación de la Virgen María', value: 'La anunciación de la Virgen María' },
          { label: 'El Sueño de José', value: 'El Sueño de José' },
          { label: 'La visitación', value: 'La visitación' },
          { label: 'El empadronamiento', value: 'El empadronamiento' },
          { label: 'María y José buscan posada', value: 'María y José buscan posada' },
          { label: 'El nacimiento de Jesús', value: 'El nacimiento de Jesús' },
          { label: 'El anuncio del Ángel a los pastores', value: 'El anuncio del Ángel a los pastores' },
          { label: 'La visita y adoración de los pastores al Niño Jesús', value: 'La visita y adoración de los pastores al Niño Jesús' },
          { label: 'La visita de los reyes magos', value: 'La visita de los reyes magos' },
          { label: 'La huida de la sagrada Familia a Egipto', value: 'La huida de la sagrada Familia a Egipto' },
          { label: 'El sacrificio de los santos inocentes', value: 'El sacrificio de los santos inocentes' },
          { label: 'La profecía de Ana y Simeón', value: 'La profecía de Ana y Simeón' },
          { label: 'La presentación del Niño en el templo', value: 'La presentación del Niño en el templo' },
          { label: 'La Sagrada Familia en Nazareth', value: 'La Sagrada Familia en Nazareth' },
          { label: 'Jesús entre los doctores de la Ley del templo de Jerusalén', value: 'Jesús entre los doctores de la Ley del templo de Jerusalén' },
          { label: 'Jesús, amigo de los niños', value: 'Jesús, amigo de los niños' },
          { label: 'Jesús en el taller de su padre José', value: 'Jesús en el taller de su padre José' },
          { label: 'Los cuatro evangelistas', value: 'Los cuatro evangelistas' }
        ]
      },
      {
        label: 'Temas Generales',
        items: [
          { label: 'Pasajes bíblicos (especificar)', value: 'Pasajes bíblicos' },
          { label: 'Personajes de la navidad (especificar)', value: 'Personajes de la navidad' },
          { label: 'Pesebres vivientes', value: 'Pesebres vivientes' },
          { label: 'Grupo folklórico (especificar)', value: 'Grupo folklórico' },
          { label: 'Grupos artístico navideño (especificar)', value: 'Grupos artístico navideño' },
          { label: 'Otros (especificar)', value: 'Otros' }
        ]
      }
    ];
  }

  initializeForm(): void {
    this.vehicleForm = this.formBuilder.group({
      // Datos personales
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      documentoIdentificacion: ['', [Validators.required, Validators.pattern(/^\d{8,12}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      
      // Datos del vehículo
      tematica: ['', [Validators.required]],
      tematicaDetalle: [''],
      tipoVehiculo: ['', [Validators.required]],
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}\d{3}$/)]]
    });
  }

  get f() { return this.vehicleForm.controls; }

  requiereDetalle(): boolean {
    const tematica = this.vehicleForm.get('tematica')?.value;
    const tematicasConDetalle = [
      'Pasajes bíblicos',
      'Personajes de la navidad',
      'Grupo folklórico',
      'Grupos artístico navideño',
      'Otros'
    ];
    return tematicasConDetalle.includes(tematica);
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // Validar que si requiere detalle, este tenga valor
    if (this.requiereDetalle() && !this.vehicleForm.get('tematicaDetalle')?.value) {
      return;
    }

    if (this.vehicleForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Preparar los datos para guardar
    const datosFormulario = { ...this.vehicleForm.value };
    
    // Si requiere detalle, combinar temática con detalle
    if (this.requiereDetalle() && datosFormulario.tematicaDetalle) {
      datosFormulario.tematica = `${datosFormulario.tematica}: ${datosFormulario.tematicaDetalle}`;
      delete datosFormulario.tematicaDetalle; // Eliminar el campo separado
    }

    console.log('Datos a enviar a Firebase:', datosFormulario);

    // Guardar en Firebase
    this.firebaseService.registrarVehiculo(datosFormulario)
      .then((docId) => {
        console.log('Vehículo registrado exitosamente con ID:', docId);
        this.messageService.add({
          severity: 'success',
          summary: '¡Registro Exitoso!',
          detail: 'Su vehículo ha sido registrado correctamente. Recibirá un correo con el código QR.',
          life: 5000
        });
        
        // Reiniciar formulario
        this.vehicleForm.reset();
        this.isSubmitted = false;
      })
      .catch((error) => {
        console.error('Error al registrar vehículo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el vehículo. Por favor, inténtelo de nuevo.',
          life: 5000
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  resetForm(): void {
    this.vehicleForm.reset();
    this.isSubmitted = false;
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}
