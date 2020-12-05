import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { loaderComponent } from './loader/loader.component';
import { ProgressBarModule } from 'primeng/progressbar';




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProgressBarModule
  ],
  exports: [
     SidebarComponent,
     HeaderComponent,
     loaderComponent,
  ],
  declarations: [
    SidebarComponent,
    HeaderComponent,
    loaderComponent
  ]
})
export class SharedModule { }
