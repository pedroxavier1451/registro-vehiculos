import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './services/firebase.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
    , private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Mostrar u ocultar el formulario según la ruta actual (ocultar para rutas /admin)
    this.showForm = !this.router.url.startsWith('/admin');
    this.routerSub = this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd)
    ).subscribe(() => {
      this.showForm = !this.router.url.startsWith('/admin');
    });
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
        alert('¡Vehículo registrado exitosamente en Firebase!');
        
        // Reiniciar formulario
        this.vehicleForm.reset();
        this.isSubmitted = false;
      })
      .catch((error) => {
        console.error('Error al registrar vehículo:', error);
        alert('Error al registrar el vehículo. Por favor, inténtalo de nuevo.');
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
