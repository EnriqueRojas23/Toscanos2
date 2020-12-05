import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { BypassComponent } from './pages/seguimiento/bypass/bypass.component';
import { SeguimientoordenComponent } from './pages/seguimientoorden/seguimientoorden.component';
import { EncuestasatisfaccionComponent } from './pages/encuestasatisfaccion/encuestasatisfaccion.component';


const appRoutes: Routes = [

  {path : 'login', component : LoginComponent},
  {path : 'seguimiento/encuestasatisfaccion/:uid/:uid2', component : EncuestasatisfaccionComponent } ,
  {
       path: '',
       component: PagesComponent,
       canActivate: [AuthGuard],
       loadChildren: './pages/pages.module#PagesModule'
   },
   {path : 'seguimiento/bypass', component : BypassComponent } ,
   {path : 'seguimiento/seguimientoorden', component : SeguimientoordenComponent } ,

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash : true } );
