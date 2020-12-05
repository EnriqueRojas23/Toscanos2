import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { AuthService } from 'src/app/_services/auth.service';

declare var jQuery:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements AfterViewInit {

  constructor(public authService: AuthService,public _sidebar: SidebarService,private router: Router) { }

  async ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
    //App.init();
 }
 activeRouteMenu(routename: string): boolean {
//    console.log(this.router.url.includes(routename));
   return this.router.url.includes(routename) == true;
}
 activeRoute(routename: string): boolean {
   return this.router.url.indexOf(routename) > -1;
 }

}
