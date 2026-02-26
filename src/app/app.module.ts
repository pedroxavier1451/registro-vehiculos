import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ValidacionComponent } from './pages/validacion/validacion.component';
import { FormularioPaseComponent } from './pages/formulario-pase/formulario-pase.component';
import { HomeComponent } from './pages/home/home.component';
import { QuincenarioComponent } from './pages/quincenario/quincenario.component';
import { ListaQuincenarioComponent } from './pages/lista-quincenario/lista-quincenario.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    RegistroComponent,
    ValidacionComponent,
    FormularioPaseComponent,
    HomeComponent,
    QuincenarioComponent,
    ListaQuincenarioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule,
    // PrimeNG
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    MessageModule,
    MenubarModule,
    MenuModule,
    GalleriaModule,
    CarouselModule,
    CalendarModule,
    InputSwitchModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeEs, 'es');
