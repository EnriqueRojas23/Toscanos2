import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, APP_ROUTES } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';

import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxUiLoaderModule, NgxUiLoaderConfig, POSITION
   , SPINNER, PB_DIRECTION, NgxUiLoaderHttpModule, NgxUiLoaderRouterModule } from  'ngx-ui-loader';
import { NgxUiLoaderDemoService } from './_services/ngx-ui-loader-demo.service.service';
import { ToastrModule } from 'ngx-toastr';
import { ProgressBarModule } from 'primeng/progressbar';
import { SeguimientoordenComponent } from './pages/seguimientoorden/seguimientoorden.component';
import { BypassComponent } from './pages/seguimiento/bypass/bypass.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgxLoadingModule } from 'ngx-loading';
import { ConfirmationService } from 'primeng/api';
import { EncuestasatisfaccionComponent } from './pages/encuestasatisfaccion/encuestasatisfaccion.component';




const ngxUiLoaderConfig: NgxUiLoaderConfig = {
   bgsColor: '#00e269',
   bgsOpacity: 0.6,
   bgsPosition: POSITION.centerCenter,
   bgsSize: 60,
   bgsType: SPINNER.circle,

   fgsColor: '#00e269',
   fgsPosition: POSITION.centerCenter,
   fgsSize: 60,
   fgsType: SPINNER.circle,
    //logoUrl: 'assets/angular.png',


   pbColor: '#00e269',
    pbDirection: PB_DIRECTION.leftToRight,
    pbThickness: 5,
    //text: 'Cargando...',
    textColor: '#FFFFFF',
    textPosition: POSITION.centerCenter
 };
 



@NgModule({
   declarations: [
      AppComponent,
      PagesComponent,
      LoginComponent,
      SeguimientoordenComponent,
      BypassComponent,
      EncuestasatisfaccionComponent

   ],
   imports: [
      BrowserModule,
      SharedModule,
      FormsModule,
      APP_ROUTES,
      HttpClientModule,
      RouterModule ,
      BrowserAnimationsModule,
      ProgressBarModule,
      ButtonModule,
      DropdownModule,
      TableModule,
      MatCardModule,
      ConfirmDialogModule,
      ProgressBarModule,
      MatProgressSpinnerModule,
      ReactiveFormsModule,

      NgxLoadingModule.forRoot({}),
      NgxUiLoaderModule,
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
      NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
      NgxUiLoaderHttpModule,

      ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-bottom-right',
         preventDuplicates: true,
         tapToDismiss: true,
       }),
   ],
   providers: [
      NgxUiLoaderDemoService,
      ConfirmationService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
