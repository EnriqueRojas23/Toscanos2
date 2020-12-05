import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PAGES_ROUTES } from './pages.routes.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlertifyService } from '../_services/alertify.service';

import { HttpClientModule } from '@angular/common/http';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { MatTableModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatIconModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTreeModule, MatDialogModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ToastrModule } from 'ngx-toastr';
import { AgGridModule } from 'ag-grid-angular';
import { ChildMessageRenderer } from '../_common/ChildMessageRenderer/ChildMessageRenderer.component';
import { ListadoordenesComponent } from './seguimiento/listadoordenes/listadoordenes.component';
import { AgmCoreModule } from '@agm/core';
import { Upload_fileComponent } from './seguimiento/upload_file/upload_file.component';
import { VerordenComponent } from './seguimiento/verorden/verorden.component';
import { EquipotransporteComponent, DialogBuscarPlaca, DialogBuscarEmpTransporte, DialogBuscarChofer } from './mantenimiento/equipotransporte/equipotransporte.component';
import { NuevousuarioComponent } from './seguridad/usuario/nuevousuario/nuevousuario.component';
import { EditarusuarioComponent } from './seguridad/usuario/editarusuario/editarusuario.component';
import { ListarolesComponent } from './seguridad/rol/listaroles/listaroles.component';
import { NuevorolComponent } from './seguridad/rol/nuevorol/nuevorol.component';
import { AsignaropcionesComponent } from './seguridad/rol/asignaropciones/asignaropciones.component';
import { ListausuariosComponent, NgbdModalConfirmAutofocus, DialogOverviewExampleDialog } from './seguridad/usuario/listausuarios/listausuarios.component';
import { TreeviewModule } from 'ngx-treeview';
import { AuthGuard } from '../_guards/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ListadoproveedoresComponent } from './mantenimiento/proveedor/listadoproveedores/listadoproveedores.component';
import { NuevoproveedorComponent } from './mantenimiento/proveedor/nuevoproveedor/nuevoproveedor.component';
import { EditarproveedorComponent } from './mantenimiento/proveedor/editarproveedor/editarproveedor.component';
import { ListadoplacasComponent } from './mantenimiento/placa/listadoplacas/listadoplacas.component';
import { NuevaplacaComponent } from './mantenimiento/placa/nuevaplaca/nuevaplaca.component';
import { EditarplacaComponent } from './mantenimiento/placa/editarplaca/editarplaca.component';
import { ListadoclienteComponent } from './mantenimiento/cliente/listadocliente/listadocliente.component';
import { NuevoclienteComponent } from './mantenimiento/cliente/nuevocliente/nuevocliente.component';
import { ChildEstadoRenderer } from '../_common/ChildEstadoRenderer/ChildEstadoRenderer.component';
import { EditarordenComponent } from './seguimiento/editarorden/editarorden.component';
import { TwoDigitDecimaNumberDirective } from '../_common/TwoDigitDecimaNumberDirective';
import { NgxLoadingModule } from 'ngx-loading';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressBarModule} from 'primeng/progressbar';
import { EditarclienteComponent } from './mantenimiento/cliente/editarcliente/editarcliente.component';

import { ListadochoferComponent } from './mantenimiento/chofer/listadochofer/listadochofer.component';
import { NuevochoferComponent } from './mantenimiento/chofer/nuevochofer/nuevochofer.component';
import {InputMaskModule} from 'primeng/inputmask';
import { EditarchoferComponent } from './mantenimiento/chofer/editarchofer/editarchofer.component';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import { ActivityComponent } from './activity/activity.component';
import { ConfirmationService } from 'primeng/api';
import { CambiarpasswordComponent } from './seguridad/usuario/cambiarpassword/cambiarpassword.component';

import {InputTextareaModule} from 'primeng/inputtextarea';

import {RatingModule} from 'primeng/rating';
import {CarouselModule} from 'primeng/carousel';
import { FileModalComponent } from './seguimiento/listadoordenes/modalfiles';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { ReporteservicioComponent } from './reporte/reporteservicio/reporteservicio.component';
import { EditIncidenciaModalComponet } from './seguimiento/verorden/modaleditincidencia';

@NgModule({
  declarations: [
    DashboardComponent,
    ListadoordenesComponent,
    Upload_fileComponent,
    ChildMessageRenderer,
    VerordenComponent,
    EquipotransporteComponent ,
    NuevousuarioComponent,
    EditarusuarioComponent,
    ListarolesComponent,
    NuevorolComponent,
    AsignaropcionesComponent,
    ListausuariosComponent ,
    NgbdModalConfirmAutofocus,
    ListadoproveedoresComponent,
    DialogOverviewExampleDialog,
    DialogBuscarPlaca,
    DialogBuscarEmpTransporte,
    DialogBuscarChofer,
    NuevoproveedorComponent,
    EditarproveedorComponent,
    ListadoplacasComponent,
    NuevaplacaComponent,
    EditarplacaComponent,
    ListadoclienteComponent,
    NuevoclienteComponent,
    ChildEstadoRenderer,
    EditarordenComponent,
    TwoDigitDecimaNumberDirective,
    EditarclienteComponent,
    ListadochoferComponent,
    NuevochoferComponent,
    EditarchoferComponent,
    ActivityComponent,
    CambiarpasswordComponent,
    FileModalComponent,
    ReporteservicioComponent,
    EditIncidenciaModalComponet

  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PAGES_ROUTES,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTreeModule,
    MatDialogModule,
    MatCheckboxModule,
    MaterialTimePickerModule,
    AngularDateTimePickerModule,
    OverlayPanelModule,


    ButtonModule,
    DropdownModule,
    TableModule,
    MatCardModule,
    ConfirmDialogModule,
    ProgressBarModule,
    MatProgressSpinnerModule,
    InputMaskModule,
    CalendarModule,
    MultiSelectModule,
    InputTextareaModule,
    RatingModule,
    CarouselModule,
    DynamicDialogModule,

    NgxLoadingModule.forRoot({}),
    AgGridModule.withComponents([
      ChildMessageRenderer,
      ChildEstadoRenderer
    ]),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      tapToDismiss: true,


    }),
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDnh35oUHQYGDPcVs6rfKOY057Xo7ujDsQ'
      }),
    TreeviewModule.forRoot(),
    AngularDualListBoxModule

   ],
  exports: [NgbdModalConfirmAutofocus],
  providers: [
    AlertifyService,
    AuthGuard,
    ConfirmationService

  ],
  bootstrap: [NgbdModalConfirmAutofocus],
  entryComponents: [
    NgbdModalConfirmAutofocus,
    DialogOverviewExampleDialog,
    DialogBuscarEmpTransporte,
    DialogBuscarPlaca,
    DialogBuscarChofer,
    FileModalComponent,
    EditIncidenciaModalComponet

    ]
})
export class PagesModule {}

