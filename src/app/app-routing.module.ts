import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ValidacionComponent } from './pages/validacion/validacion.component';
import { FormularioPaseComponent } from './pages/formulario-pase/formulario-pase.component';
import { HomeComponent } from './pages/home/home.component';
import { QuincenarioComponent } from './pages/quincenario/quincenario.component';
import { ListaQuincenarioComponent } from './pages/lista-quincenario/lista-quincenario.component';

const routes: Routes = [
  // Página principal
  { path: '', component: HomeComponent },

  // Ruta secreta para login de administradores (no hay enlaces visibles hacia aquí)
  { path: 'admin', component: RegistroComponent },

  // Panel de administración (accesible solo tras login exitoso)
  { path: 'admin/panel', component: AdminComponent },

  // Página de validación de códigos QR
  { path: 'admin/validacion', component: ValidacionComponent },

  { path: 'formulario', component: FormularioPaseComponent },

  { path: 'quincenario', component: QuincenarioComponent },

  { path: 'admin/lista-quincenario', component: ListaQuincenarioComponent },

  // Redirigir cualquier otra ruta a la página principal
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
