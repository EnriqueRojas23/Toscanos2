import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListadoordenesComponent } from './seguimiento/listadoordenes/listadoordenes.component';
import { Upload_fileComponent } from './seguimiento/upload_file/upload_file.component';
import { EquipotransporteComponent } from './mantenimiento/equipotransporte/equipotransporte.component';
import { VerordenComponent } from './seguimiento/verorden/verorden.component';
import { ListarolesComponent } from './seguridad/rol/listaroles/listaroles.component';
import { AuthGuard } from '../_guards/auth.guard';
import { NuevorolComponent } from './seguridad/rol/nuevorol/nuevorol.component';
import { AsignaropcionesComponent } from './seguridad/rol/asignaropciones/asignaropciones.component';
import { ListausuariosComponent } from './seguridad/usuario/listausuarios/listausuarios.component';
import { NuevousuarioComponent } from './seguridad/usuario/nuevousuario/nuevousuario.component';
import { EditarusuarioComponent } from './seguridad/usuario/editarusuario/editarusuario.component';
import { ListadoproveedoresComponent } from './mantenimiento/proveedor/listadoproveedores/listadoproveedores.component';
import { NuevoproveedorComponent } from './mantenimiento/proveedor/nuevoproveedor/nuevoproveedor.component';
import { EditarproveedorComponent } from './mantenimiento/proveedor/editarproveedor/editarproveedor.component';
import { ListadoplacasComponent } from './mantenimiento/placa/listadoplacas/listadoplacas.component';
import { NuevaplacaComponent } from './mantenimiento/placa/nuevaplaca/nuevaplaca.component';
import { EditarplacaComponent } from './mantenimiento/placa/editarplaca/editarplaca.component';
import { ListadoclienteComponent } from './mantenimiento/cliente/listadocliente/listadocliente.component';
import { NuevoclienteComponent } from './mantenimiento/cliente/nuevocliente/nuevocliente.component';
import { EditarordenComponent } from './seguimiento/editarorden/editarorden.component';
import { EditarclienteComponent } from './mantenimiento/cliente/editarcliente/editarcliente.component';
import { SeguimientoordenComponent } from './seguimientoorden/seguimientoorden.component';
import { BypassComponent } from './seguimiento/bypass/bypass.component';
import { ListadochoferComponent } from './mantenimiento/chofer/listadochofer/listadochofer.component';
import { NuevochoferComponent } from './mantenimiento/chofer/nuevochofer/nuevochofer.component';
import { EditarchoferComponent } from './mantenimiento/chofer/editarchofer/editarchofer.component';
import { ActivityComponent } from './activity/activity.component';
import { CambiarpasswordComponent } from './seguridad/usuario/cambiarpassword/cambiarpassword.component';
import { ReporteservicioComponent } from './reporte/reporteservicio/reporteservicio.component';



const pagesRoutes: Routes = [

    {path : 'dashboard', component : DashboardComponent } ,
    {path : 'seguimiento/listaorden', component : ListadoordenesComponent , canActivate: [AuthGuard]} ,
    {path : 'seguimiento/uploadfile', component : Upload_fileComponent , canActivate: [AuthGuard]} ,
    {path : 'seguimiento/verorden/:uid', component : VerordenComponent , canActivate: [AuthGuard]} ,

    {path : 'seguimiento/editarorden/:uid', component : EditarordenComponent , canActivate: [AuthGuard]} ,
    {path : 'activity', component : ActivityComponent } ,

    {path : 'reporte/reporteservicio', component : ReporteservicioComponent , canActivate: [AuthGuard]} ,



    {path : 'mantenimiento/equipotransporte/:uid', component : EquipotransporteComponent , canActivate: [AuthGuard]} ,
    {path : 'mantenimiento/listadoproveedores', component : ListadoproveedoresComponent , } ,
    {path : 'mantenimiento/nuevoproveedor', component : NuevoproveedorComponent , } ,
    {path : 'mantenimiento/editarproveedor/:uid', component : EditarproveedorComponent , } ,
    {path : 'mantenimiento/listadoplacas', component : ListadoplacasComponent , } ,
    {path : 'mantenimiento/nuevaplaca', component : NuevaplacaComponent , } ,
    {path : 'mantenimiento/editarplaca/:uid', component : EditarplacaComponent , } ,
    {path : 'mantenimiento/listadoclientes', component : ListadoclienteComponent , } ,
    {path : 'mantenimiento/nuevocliente', component : NuevoclienteComponent , canActivate: [AuthGuard]} ,
    {path : 'mantenimiento/editarcliente/:uid', component : EditarclienteComponent , canActivate: [AuthGuard]} ,
    {path : 'mantenimiento/listadoconductores', component : ListadochoferComponent , canActivate: [AuthGuard]} ,
    {path : 'mantenimiento/nuevochofer', component : NuevochoferComponent , canActivate: [AuthGuard]} ,
    {path : 'mantenimiento/editarchofer/:uid', component : EditarchoferComponent } ,

    {path : 'seguridad/listaroles', component : ListarolesComponent , canActivate: [AuthGuard]} ,
    {path : 'seguridad/nuevorol', component : NuevorolComponent , canActivate: [AuthGuard]} ,
    {path : 'seguridad/asignaropciones/:uid', component : AsignaropcionesComponent} ,
    {path : 'seguridad/listausuarios', component : ListausuariosComponent, canActivate: [AuthGuard]} ,
    {path : 'seguridad/nuevousuario', component : NuevousuarioComponent, canActivate: [AuthGuard]} ,
    {path : 'seguridad/editarusuario/:uid', component : EditarusuarioComponent, canActivate: [AuthGuard]} ,
    {path : 'seguridad/cambiarpassword/:uid', component : CambiarpasswordComponent, canActivate: [AuthGuard]} ,
];

@NgModule({
  imports: [RouterModule.forRoot(pagesRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
