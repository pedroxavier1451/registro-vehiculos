import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ValidacionComponent } from './pages/validacion/validacion.component';

const routes: Routes = [
  // Ruta secreta para login de administradores (no hay enlaces visibles hacia aquí)
  { path: 'admin', component: RegistroComponent },

  // Panel de administración (accesible solo tras login exitoso)
  { path: 'admin/panel', component: AdminComponent },

  // Página de validación de códigos QR
  { path: 'admin/validacion', component: ValidacionComponent },

  // Redirigir cualquier otra ruta a la raíz (AppComponent mostrará la UI pública)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
